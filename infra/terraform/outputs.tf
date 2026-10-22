/**
 * VYRON Infrastructure as Code — Outputs
 * Milestone: A.17
 */

output "vpc_id" {
  description = "The ID of the provisioned VYRON VPC"
  value       = aws_vpc.vyron_core_vpc.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private isolated subnets"
  value       = aws_subnet.private[*].id
}

output "ecs_cluster_name" {
  description = "Name of the ECS container cluster"
  value       = aws_ecs_cluster.vyron_cluster.name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS container cluster"
  value       = aws_ecs_cluster.vyron_cluster.arn
}

output "log_group_name" {
  description = "CloudWatch log group for container telemetry"
  value       = aws_cloudwatch_log_group.vyron_logs.name
}
