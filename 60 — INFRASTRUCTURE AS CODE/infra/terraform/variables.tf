/**
 * VYRON Infrastructure as Code — Input Variables
 * Milestone: A.17
 */

variable "aws_region" {
  type        = string
  description = "Target AWS deployment region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment (production, staging, dev)"
  default     = "production"
  validation {
    condition     = contains(["production", "staging", "dev"], var.environment)
    error_message = "Environment must be one of: production, staging, dev."
  }
}

variable "vpc_cidr" {
  type        = string
  description = "Base CIDR block for VPC topology"
  default     = "10.0.0.0/16"
}

variable "container_image" {
  type        = string
  description = "Target Docker image tag for VYRON container deployment"
  default     = "ghcr.io/vyron-ai/vyron-core:v2.4.0"
}

variable "desired_container_count" {
  type        = number
  description = "Number of Fargate task replicas"
  default     = 3
}

variable "cpu_units" {
  type        = number
  description = "Fargate CPU units (1024 = 1 vCPU)"
  default     = 2048
}

variable "memory_mb" {
  type        = number
  description = "Fargate memory allocation in MB"
  default     = 4096
}
