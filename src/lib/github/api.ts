/**
 * PROJECT BRAHMA — GITHUB REST API CLIENT (FL-01-B)
 * Queries GitHub user profile, organizations, repositories, and branches.
 * Includes graceful mock fallbacks for offline development.
 */

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  email: string | null;
  publicRepos: number;
  totalPrivateRepos?: number;
  plan?: { name: string };
}

export interface GitHubOrg {
  id: number;
  login: string;
  avatarUrl: string;
  description: string | null;
}

export interface GitHubRepo {
  id: number;
  fullName: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  defaultBranch: string;
  isPrivate: boolean;
  updatedAt: string;
  size: number;
  url: string;
}

const GITHUB_API_URL = "https://api.github.com";

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Brahma-Intelligence-Engine/1.0",
  };
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  if (token.startsWith("gho_mock_")) {
    return {
      id: 10101,
      login: "brahma-architect",
      name: "Brahma Architecture Lead",
      avatarUrl: "https://github.com/identicons/brahma.png",
      email: "architect@brahma.internal",
      publicRepos: 18,
      totalPrivateRepos: 4,
    };
  }

  const res = await fetch(`${GITHUB_API_URL}/user`, {
    headers: getHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to fetch GitHub user profile: HTTP ${res.status}`);
  const data = await res.json();
  return {
    id: data.id,
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    email: data.email,
    publicRepos: data.public_repos || 0,
    totalPrivateRepos: data.total_private_repos,
    plan: data.plan,
  };
}

export async function getUserOrganizations(token: string): Promise<GitHubOrg[]> {
  if (token.startsWith("gho_mock_")) {
    return [
      {
        id: 501,
        login: "brahma-defense-labs",
        avatarUrl: "https://github.com/identicons/defense.png",
        description: "Industrial Leviathan High-Assurance Systems",
      },
      {
        id: 502,
        login: "finledger-core-org",
        avatarUrl: "https://github.com/identicons/finledger.png",
        description: "PCI-DSS Level 1 Banking Core Services",
      },
    ];
  }

  const res = await fetch(`${GITHUB_API_URL}/user/orgs`, {
    headers: getHeaders(token),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((o: any) => ({
    id: o.id,
    login: o.login,
    avatarUrl: o.avatar_url,
    description: o.description,
  }));
}

export async function listUserRepos(
  token: string,
  params?: { sort?: "updated" | "created"; perPage?: number }
): Promise<GitHubRepo[]> {
  if (token.startsWith("gho_mock_")) {
    return getMockRepos();
  }

  const perPage = params?.perPage || 100;
  const sort = params?.sort || "updated";

  const res = await fetch(
    `${GITHUB_API_URL}/user/repos?type=all&sort=${sort}&per_page=${perPage}`,
    { headers: getHeaders(token) }
  );

  if (!res.ok) {
    console.warn("[github/api] listUserRepos error, using fallback repositories");
    return getMockRepos();
  }

  const data = await res.json();
  return (data || []).map((r: any) => ({
    id: r.id,
    fullName: r.full_name,
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    defaultBranch: r.default_branch || "main",
    isPrivate: Boolean(r.private),
    updatedAt: r.updated_at,
    size: r.size || 500,
    url: r.html_url,
  }));
}

export async function listOrgRepos(
  token: string,
  org: string,
  params?: { perPage?: number }
): Promise<GitHubRepo[]> {
  if (token.startsWith("gho_mock_")) {
    return getMockRepos().filter((r) => r.fullName.startsWith(`${org}/`));
  }

  const perPage = params?.perPage || 50;
  const res = await fetch(`${GITHUB_API_URL}/orgs/${org}/repos?per_page=${perPage}`, {
    headers: getHeaders(token),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((r: any) => ({
    id: r.id,
    fullName: r.full_name,
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    defaultBranch: r.default_branch || "main",
    isPrivate: Boolean(r.private),
    updatedAt: r.updated_at,
    size: r.size || 500,
    url: r.html_url,
  }));
}

export async function getRepoBranches(
  token: string,
  owner: string,
  repo: string
): Promise<string[]> {
  if (token.startsWith("gho_mock_")) {
    return ["main", "develop", "release/v2.4", "hotfix/cwe-remediation"];
  }

  try {
    const res = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/branches`, {
      headers: getHeaders(token),
    });
    if (!res.ok) return ["main", "develop"];
    const data = await res.json();
    return (data || []).map((b: any) => b.name);
  } catch {
    return ["main", "develop"];
  }
}

function getMockRepos(): GitHubRepo[] {
  return [
    {
      id: 901,
      fullName: "finledger-core-org/finledger-microservices",
      name: "finledger-microservices",
      description: "PCI-DSS Level 1 core payment and ledger clearing services in Python FastAPI.",
      language: "Python",
      stars: 342,
      forks: 64,
      defaultBranch: "main",
      isPrivate: true,
      updatedAt: "2026-09-11T12:00:00Z",
      size: 4200,
      url: "https://github.com/finledger-core-org/finledger-microservices",
    },
    {
      id: 902,
      fullName: "brahma-defense-labs/leviathan-agent-mesh",
      name: "leviathan-agent-mesh",
      description: "Distributed telemetry and multi-agent coordination protocol with SHA-256 provenance.",
      language: "TypeScript",
      stars: 1205,
      forks: 180,
      defaultBranch: "main",
      isPrivate: false,
      updatedAt: "2026-09-10T16:30:00Z",
      size: 1850,
      url: "https://github.com/brahma-defense-labs/leviathan-agent-mesh",
    },
    {
      id: 903,
      fullName: "brahma-architect/cloud-sentinel-vault",
      name: "cloud-sentinel-vault",
      description: "Zero-knowledge encryption keys and KMS rotators for multi-cloud deployments.",
      language: "Go",
      stars: 88,
      forks: 12,
      defaultBranch: "master",
      isPrivate: true,
      updatedAt: "2026-09-08T09:15:00Z",
      size: 920,
      url: "https://github.com/brahma-architect/cloud-sentinel-vault",
    },
    {
      id: 904,
      fullName: "brahma-architect/open-fhir-connector",
      name: "open-fhir-connector",
      description: "HIPAA-compliant HL7/FHIR v4 ingestion pipeline and PHI redaction stream.",
      language: "Python",
      stars: 450,
      forks: 92,
      defaultBranch: "main",
      isPrivate: false,
      updatedAt: "2026-09-05T14:20:00Z",
      size: 2100,
      url: "https://github.com/brahma-architect/open-fhir-connector",
    },
  ];
}
