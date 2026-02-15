import { type NodeType } from "../../types/diagrams";

// GCP Icons
import cloudRunIcon from "../cloud-services/gcp/cloud-run.svg";
import cloudStorageIcon from "../cloud-services/gcp/cloud-storage.svg";
import bigqueryIcon from "../cloud-services/gcp/bigquery.svg";
import pubSubIcon from "../cloud-services/gcp/pub-sub.svg";
import apigeeIcon from "../cloud-services/gcp/apigee.svg";
import billingIcon from "../cloud-services/gcp/billing.svg";
import cloudBuildIcon from "../cloud-services/gcp/cloud-build.svg";
import cloudMonitoringIcon from "../cloud-services/gcp/cloud-monitoring.svg";
import cloudSqlIcon from "../cloud-services/gcp/cloud-sql.svg";
import computeEngineIcon from "../cloud-services/gcp/compute-engine.svg";
import iamIcon from "../cloud-services/gcp/iam.svg";
import kubernetesIcon from "../cloud-services/gcp/kubernetes.svg";
import securityIcon from "../cloud-services/gcp/security.svg";

// AWS Icons
import ec2Icon from "../cloud-services/aws/ec2.svg";
import s3Icon from "../cloud-services/aws/s3.svg";
import lambdaIcon from "../cloud-services/aws/lambda.svg";
import rdsIcon from "../cloud-services/aws/rds.svg";
import eksIcon from "../cloud-services/aws/eks.svg";
import cloudwatchIcon from "../cloud-services/aws/cloudwatch.svg";
import awsIamIcon from "../cloud-services/aws/iam.svg";
import awsApiGatewayIcon from "../cloud-services/aws/api-gateway.svg";
import codebuildIcon from "../cloud-services/aws/codebuild.svg";
import codepipelineIcon from "../cloud-services/aws/codepipeline.svg";
import sqsIcon from "../cloud-services/aws/sqs.svg";
import snsIcon from "../cloud-services/aws/sns.svg";
import dynamodbIcon from "../cloud-services/aws/dynamodb.svg";
import cloudfrontIcon from "../cloud-services/aws/cloudfront.svg";
import fargateIcon from "../cloud-services/aws/fargate.svg";

// Azure Icons
import vmIcon from "../cloud-services/azure/vm.svg";
import blobStorageIcon from "../cloud-services/azure/blob-storage.svg";
import functionsIcon from "../cloud-services/azure/functions.svg";
import sqlDatabaseIcon from "../cloud-services/azure/sql-database.svg";
import aksIcon from "../cloud-services/azure/aks.svg";
import azureMonitorIcon from "../cloud-services/azure/monitor.svg";
import entraIdIcon from "../cloud-services/azure/entra-id.svg";
import apiManagementIcon from "../cloud-services/azure/api-management.svg";
import azureDevopsIcon from "../cloud-services/azure/devops.svg";
import serviceBusIcon from "../cloud-services/azure/service-bus.svg";
import eventGridIcon from "../cloud-services/azure/event-grid.svg";
import cosmosDbIcon from "../cloud-services/azure/cosmos-db.svg";
import containerAppsIcon from "../cloud-services/azure/container-apps.svg";
import keyVaultIcon from "../cloud-services/azure/key-vault.svg";

// NoSQL DB Icons
import mongodbIcon from "../cloud-services/nosql-db/mongodb.svg";
import redisIcon from "../cloud-services/nosql-db/redis.svg";
import cassandraIcon from "../cloud-services/nosql-db/cassandra.svg";
import couchdbIcon from "../cloud-services/nosql-db/couchdb.svg";
import firebaseIcon from "../cloud-services/nosql-db/firebase.svg";
import influxdbIcon from "../cloud-services/nosql-db/influxdb.svg";
import rocksdbIcon from "../cloud-services/nosql-db/rocksdb.svg";

// SQL DB Icons
import mysqlIcon from "../cloud-services/sql-db/mysql.svg";
import postgresqlIcon from "../cloud-services/sql-db/postgressql.svg";
import sqliteIcon from "../cloud-services/sql-db/sqlite.svg";
import oracleIcon from "../cloud-services/sql-db/oracle.svg";
import mssqlIcon from "../cloud-services/sql-db/microsoft-sql-server.svg";
import sqlalchemyIcon from "../cloud-services/sql-db/sqlalchemy.svg";

// Shape Icons
import shapeCircleIcon from "../cloud-services/shapes/circle.svg";
import shapeSquareIcon from "../cloud-services/shapes/square.svg";
import shapeStarIcon from "../cloud-services/shapes/star.svg";
import shapeHexagonIcon from "../cloud-services/shapes/hexagon.svg";

// Animated Icons
import animatedApiIcon from "../cloud-services/animated/api.gif";
import animatedClickIcon from "../cloud-services/animated/click.gif";
import animatedCloudIcon from "../cloud-services/animated/cloud.gif";
import animatedDoubleCheckIcon from "../cloud-services/animated/double-check.gif";
import animatedLoadingBubbleIcon from "../cloud-services/animated/loading-bubble.gif";
import animatedLoadingIcon from "../cloud-services/animated/loading.gif";
import animatedRocketIcon from "../cloud-services/animated/rocket.gif";
import animatedSettingsIcon from "../cloud-services/animated/settings.gif";
import animatedTargetIcon from "../cloud-services/animated/target.gif";
import animatedUploadCloudIcon from "../cloud-services/animated/upload-cloud.gif";
import animatedUploadIcon from "../cloud-services/animated/upload.gif";
import animatedVerifiedIcon from "../cloud-services/animated/verified.gif";
import animatedWorkerIcon from "../cloud-services/animated/worker.gif";

export const cloudServiceIcons: Record<string, string> = {
  "gcp-cloud-run": cloudRunIcon,
  "gcp-cloud-storage": cloudStorageIcon,
  "gcp-bigquery": bigqueryIcon,
  "gcp-pub-sub": pubSubIcon,
  "gcp-apigee": apigeeIcon,
  "gcp-billing": billingIcon,
  "gcp-cloud-build": cloudBuildIcon,
  "gcp-cloud-monitoring": cloudMonitoringIcon,
  "gcp-cloud-sql": cloudSqlIcon,
  "gcp-compute-engine": computeEngineIcon,
  "gcp-iam": iamIcon,
  "gcp-kubernetes": kubernetesIcon,
  "gcp-security": securityIcon,
  "aws-ec2": ec2Icon,
  "aws-s3": s3Icon,
  "aws-lambda": lambdaIcon,
  "aws-rds": rdsIcon,
  "aws-eks": eksIcon,
  "aws-cloudwatch": cloudwatchIcon,
  "aws-iam": awsIamIcon,
  "aws-api-gateway": awsApiGatewayIcon,
  "aws-codebuild": codebuildIcon,
  "aws-codepipeline": codepipelineIcon,
  "aws-sqs": sqsIcon,
  "aws-sns": snsIcon,
  "aws-dynamodb": dynamodbIcon,
  "aws-cloudfront": cloudfrontIcon,
  "aws-fargate": fargateIcon,
  "azure-vm": vmIcon,
  "azure-blob-storage": blobStorageIcon,
  "azure-functions": functionsIcon,
  "azure-sql-database": sqlDatabaseIcon,
  "azure-aks": aksIcon,
  "azure-monitor": azureMonitorIcon,
  "azure-entra-id": entraIdIcon,
  "azure-api-management": apiManagementIcon,
  "azure-devops": azureDevopsIcon,
  "azure-service-bus": serviceBusIcon,
  "azure-event-grid": eventGridIcon,
  "azure-cosmos-db": cosmosDbIcon,
  "azure-container-apps": containerAppsIcon,
  "azure-key-vault": keyVaultIcon,
  "nosql-mongodb": mongodbIcon,
  "nosql-redis": redisIcon,
  "nosql-cassandra": cassandraIcon,
  "nosql-couchdb": couchdbIcon,
  "nosql-firebase": firebaseIcon,
  "nosql-influxdb": influxdbIcon,
  "nosql-rocksdb": rocksdbIcon,
  "sql-mysql": mysqlIcon,
  "sql-postgresql": postgresqlIcon,
  "sql-sqlite": sqliteIcon,
  "sql-oracle": oracleIcon,
  "sql-mssql": mssqlIcon,
  "sql-sqlalchemy": sqlalchemyIcon,
  "shape-circle": shapeCircleIcon,
  "shape-square": shapeSquareIcon,
  "shape-star": shapeStarIcon,
  "shape-hexagon": shapeHexagonIcon,
  "animated-api": animatedApiIcon,
  "animated-click": animatedClickIcon,
  "animated-cloud": animatedCloudIcon,
  "animated-double-check": animatedDoubleCheckIcon,
  "animated-loading-bubble": animatedLoadingBubbleIcon,
  "animated-loading": animatedLoadingIcon,
  "animated-rocket": animatedRocketIcon,
  "animated-settings": animatedSettingsIcon,
  "animated-target": animatedTargetIcon,
  "animated-upload-cloud": animatedUploadCloudIcon,
  "animated-upload": animatedUploadIcon,
  "animated-verified": animatedVerifiedIcon,
  "animated-worker": animatedWorkerIcon,
};

export const isCloudService = (nodeType: NodeType): boolean => {
  return nodeType in cloudServiceIcons;
};
