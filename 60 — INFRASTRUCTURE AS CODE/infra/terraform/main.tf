/**
 * VYRON Autonomous Enterprise Platform — Production Infrastructure as Code (IaC)
 * Provider: HashiCorp Terraform (AWS & Cloudflare Providers)
 * Milestone: A.17 (Infrastructure as Code templates and automated deployment manifests)
 * Invariants: Zero-Fiction Architecture Law, Zero Raw SQL Mandate, RLS Multi-Tenancy
 */

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.20"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "vyron-terraform-state-prod"
    key            = "vyron/production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "vyron-tf-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Platform    = "VYRON"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Compliance  = "SOC2-TypeII"
    }
  }
}

# --- VPC & Network Topologies ---
resource "aws_vpc" "vyron_core_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vyron-${var.environment}-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.vyron_core_vpc.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "vyron-${var.environment}-public-${count.index + 1}"
    Type = "Public"
  }
}

resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.vyron_core_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 4)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "vyron-${var.environment}-private-${count.index + 1}"
    Type = "Private"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vyron_core_vpc.id

  tags = {
    Name = "vyron-${var.environment}-igw"
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "vyron-${var.environment}-nat"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vyron_core_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "vyron-${var.environment}-public-rt"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vyron_core_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "vyron-${var.environment}-private-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = 3
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = 3
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# --- ECS Cluster & Fargate Services ---
resource "aws_ecs_cluster" "vyron_cluster" {
  name = "vyron-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "vyron-${var.environment}-ecs-tasks-sg"
  description = "Allows ingress from Cloudflare edge and VPC internal services"
  vpc_id      = aws_vpc.vyron_core_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
    description = "Internal ALB ingress"
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "vyron-${var.environment}-ecs-tasks-sg"
  }
}

# --- IAM Roles for Zero-Trust Task Execution ---
resource "aws_iam_role" "ecs_execution_role" {
  name = "vyron-${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "vyron-${var.environment}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
      }
    ]
  })
}

# --- CloudWatch Log Group ---
resource "aws_cloudwatch_log_group" "vyron_logs" {
  name              = "/ecs/vyron-${var.environment}"
  retention_in_days = 90

  tags = {
    Name = "vyron-${var.environment}-logs"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}
