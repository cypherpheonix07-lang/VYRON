"""
PROJECT BRAHMA — ENTERPRISE LINK HEALTH CRAWLER & TELEMETRY ENGINE
Asynchronous, SSRF-hardened probe engine for catalog URL validation,
exponential backoff retries, latency benchmarking, and health classification.
"""

import socket
import ipaddress
import urllib.parse
import time
import random
import logging
from typing import Dict, Any, List, Optional, Tuple
import requests

logger = logging.getLogger("brahma.crawler")

# Disallowed internal & cloud metadata hosts
BLOCKED_HOSTNAMES = {
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "metadata.google.internal",
    "metadata.internal",
    "instance-data",
    "169.254.169.254",
    "kubernetes.default",
}

DEFAULT_USER_AGENT = "Brahma-LinkHealthBot/1.0 (+https://brahma.ai/bot; security-and-availability-telemetry)"


def is_ip_private_or_restricted(ip_str: str) -> bool:
    """
    Evaluates whether an IP address belongs to private, loopback,
    link-local, cloud metadata, or reserved ranges.
    """
    try:
        ip = ipaddress.ip_address(ip_str)
        return (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        )
    except ValueError:
        return True


def validate_url_ssrf(url: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Strict SSRF validation.
    Resolves DNS and asserts target IP does not map to localhost, RFC1918 private subnets,
    link-local addresses, or cloud metadata endpoints.
    Returns: (is_safe, resolved_ip, error_message)
    """
    try:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False, None, f"Unsupported scheme: {parsed.scheme}"

        hostname = parsed.hostname
        if not hostname:
            return False, None, "Missing hostname in URL"

        # Check blacklisted hostnames
        if hostname.lower() in BLOCKED_HOSTNAMES or hostname.endswith(".internal") or hostname.endswith(".local"):
            return False, None, f"Restricted hostname rejected by SSRF firewall: {hostname}"

        # Safe DNS resolution
        addr_info = socket.getaddrinfo(hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
        if not addr_info:
            return False, None, f"Could not resolve DNS for host: {hostname}"

        for entry in addr_info:
            ip = entry[4][0]
            if is_ip_private_or_restricted(ip):
                return False, ip, f"SSRF Protection: Host {hostname} resolves to restricted/private IP: {ip}"

        primary_ip = addr_info[0][4][0]
        return True, primary_ip, None

    except socket.gaierror as e:
        return False, None, f"DNS resolution failed: {str(e)}"
    except Exception as e:
        return False, None, f"URL validation error: {str(e)}"


class LinkHealthCrawler:
    """
    Hardened crawler performing safe HTTP probes with exponential backoff,
    SSRF defense, and classification scoring.
    """

    def __init__(self, max_retries: int = 2, timeout_seconds: float = 6.0):
        self.max_retries = max_retries
        self.timeout_seconds = timeout_seconds
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": DEFAULT_USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })

    def probe_tool_url(self, tool_id: str, url: str) -> Dict[str, Any]:
        """
        Executes a multi-stage, respectful HTTP health probe.
        """
        start_probe_time = time.time()
        checked_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        # 1. SSRF Pre-flight Validation
        is_safe, resolved_ip, ssrf_error = validate_url_ssrf(url)
        if not is_safe:
            logger.warning(f"[CRAWLER:SSRF_BLOCK] {url} -> {ssrf_error}")
            return {
                "tool_id": tool_id,
                "url": url,
                "checked_at": checked_at,
                "status": "critical",
                "http_status": 403,
                "response_time_ms": 0,
                "final_url": url,
                "error_code": "SSRF_BLOCKED",
                "error_message": ssrf_error,
                "attempt_count": 0,
                "is_ssrf_safe": False,
                "health_score": 10,
            }

        # 2. Resilient Probe Loop with Exponential Backoff + Jitter
        attempt = 0
        last_error = None
        response_time_ms = 0
        http_status = 0
        final_url = url

        while attempt <= self.max_retries:
            attempt += 1
            req_start = time.time()
            try:
                # Issue lightweight HEAD request first; fallback to stream GET if 405 Method Not Allowed
                resp = self.session.head(
                    url,
                    timeout=self.timeout_seconds,
                    allow_redirects=True,
                    stream=True
                )
                if resp.status_code == 405:
                    resp = self.session.get(
                        url,
                        timeout=self.timeout_seconds,
                        allow_redirects=True,
                        stream=True
                    )

                response_time_ms = int(round((time.time() - req_start) * 1000))
                http_status = resp.status_code
                final_url = str(resp.url)

                # Validate redirect destination for SSRF
                if final_url != url:
                    redir_safe, _, redir_err = validate_url_ssrf(final_url)
                    if not redir_safe:
                        return {
                            "tool_id": tool_id,
                            "url": url,
                            "checked_at": checked_at,
                            "status": "critical",
                            "http_status": 308,
                            "response_time_ms": response_time_ms,
                            "final_url": final_url,
                            "error_code": "REDIRECT_SSRF_BLOCKED",
                            "error_message": redir_err,
                            "attempt_count": attempt,
                            "is_ssrf_safe": False,
                            "health_score": 15,
                        }

                # If status is successful or warning, stop retry
                if http_status < 500 and http_status != 408:
                    break

            except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
                last_error = e
                response_time_ms = int(round((time.time() - req_start) * 1000))
                if attempt <= self.max_retries:
                    # Exponential backoff with jitter: 0.5s * 2^attempt + random(0, 0.2)
                    backoff = (0.5 * (2 ** (attempt - 1))) + random.uniform(0.05, 0.2)
                    time.sleep(backoff)
            except Exception as e:
                last_error = e
                break

        # 3. Health Classification
        status, health_score, err_code, err_msg = self._classify_result(
            http_status=http_status,
            latency_ms=response_time_ms,
            error=last_error
        )

        return {
            "tool_id": tool_id,
            "url": url,
            "checked_at": checked_at,
            "status": status,
            "http_status": http_status,
            "response_time_ms": response_time_ms,
            "final_url": final_url,
            "error_code": err_code,
            "error_message": err_msg,
            "attempt_count": attempt,
            "is_ssrf_safe": True,
            "health_score": health_score,
        }

    def _classify_result(
        self,
        http_status: int,
        latency_ms: int,
        error: Optional[Exception]
    ) -> Tuple[str, int, Optional[str], Optional[str]]:
        """
        Classifies status into HEALTHY, DEGRADED, WARNING, CRITICAL, OFFLINE, UNKNOWN
        """
        if error is not None:
            err_str = str(error)
            if "Timeout" in err_str:
                return "degraded", 50, "TIMEOUT", "Connection or read timed out across retries."
            if "ConnectionRefused" in err_str or "Failed to establish a new connection" in err_str:
                return "offline", 10, "CONNECTION_REFUSED", "Host connection refused."
            if "NameResolutionError" in err_str or "gaierror" in err_str:
                return "offline", 5, "DNS_FAILURE", "Domain name resolution failed."
            return "degraded", 45, "NETWORK_ERROR", err_str

        # Evaluate HTTP status code
        if 200 <= http_status < 300:
            if latency_ms > 2000:
                return "degraded", 65, None, "Severe latency (>2000ms)"
            elif latency_ms > 1000:
                return "degraded", 78, None, "Elevated latency (>1000ms)"
            return "healthy", 96, None, None

        if http_status == 429:
            return "warning", 60, "RATE_LIMITED", "HTTP 429 Too Many Requests detected."

        if http_status in (404, 410):
            return "offline", 15, "DEAD_LINK", f"HTTP {http_status} Not Found / Gone."

        if 400 <= http_status < 500:
            return "warning", 68, f"HTTP_{http_status}", f"Client error status: HTTP {http_status}"

        if http_status >= 500:
            return "critical", 30, f"HTTP_{http_status}", f"Upstream server error: HTTP {http_status}"

        return "unknown", 70, None, None


# Global singleton instance
crawler = LinkHealthCrawler()
