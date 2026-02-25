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

// OCI Icons
import ociVirtualMachineIcon from "../cloud-services/oci/virtual-machine.svg";
import ociObjectStorageIcon from "../cloud-services/oci/object-storage.svg";
import ociVcnIcon from "../cloud-services/oci/vcn.svg";
import ociAutonomousDatabaseIcon from "../cloud-services/oci/autonomous-database.svg";
import ociLoadBalancerIcon from "../cloud-services/oci/load-balancer.svg";
import ociOkeIcon from "../cloud-services/oci/oke.svg";
import ociIamIcon from "../cloud-services/oci/iam.svg";
import ociFunctionsIcon from "../cloud-services/oci/functions.svg";
import ociApiGatewayIcon from "../cloud-services/oci/api-gateway.svg";
import ociBlockStorageIcon from "../cloud-services/oci/block-storage.svg";
import ociDnsIcon from "../cloud-services/oci/dns.svg";
import ociWafIcon from "../cloud-services/oci/waf.svg";
import ociMonitoringIcon from "../cloud-services/oci/monitoring.svg";
import ociContainerRegistryIcon from "../cloud-services/oci/container-registry.svg";
import ociExadataIcon from "../cloud-services/oci/exadata.svg";

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

// Programming Language Icons
import proglangAplIcon from "../cloud-services/programming-language/APL.svg";
import proglangBallerinaIcon from "../cloud-services/programming-language/Ballerina.svg";
import proglangCIcon from "../cloud-services/programming-language/CLang.svg";
import proglangClojureIcon from "../cloud-services/programming-language/Clojure.svg";
import proglangClojureScriptIcon from "../cloud-services/programming-language/ClojureScript.svg";
import proglangCppIcon from "../cloud-services/programming-language/CPlusPlus.svg";
import proglangCsharpIcon from "../cloud-services/programming-language/CSharp.svg";
import proglangErlangIcon from "../cloud-services/programming-language/ErLang.svg";
import proglangFsharpIcon from "../cloud-services/programming-language/FSharp.svg";
import proglangGoIcon from "../cloud-services/programming-language/GoLang.svg";
import proglangHaskellIcon from "../cloud-services/programming-language/Haskell.svg";
import proglangJuleIcon from "../cloud-services/programming-language/Jule.svg";
import proglangNimIcon from "../cloud-services/programming-language/Nim.svg";
import proglangObjectiveCIcon from "../cloud-services/programming-language/ObjectiveC.svg";
import proglangPerlIcon from "../cloud-services/programming-language/Perl.svg";
import proglangPureScriptIcon from "../cloud-services/programming-language/PureScript.svg";
import proglangPythonIcon from "../cloud-services/programming-language/Python.svg";
import proglangRubyIcon from "../cloud-services/programming-language/Ruby.svg";
import proglangSwiftIcon from "../cloud-services/programming-language/Swift.svg";
import proglangValaIcon from "../cloud-services/programming-language/Vala.svg";
import proglangVyperIcon from "../cloud-services/programming-language/Vyper.svg";
import proglangZigIcon from "../cloud-services/programming-language/Zig.svg";

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
  "oci-virtual-machine": ociVirtualMachineIcon,
  "oci-object-storage": ociObjectStorageIcon,
  "oci-vcn": ociVcnIcon,
  "oci-autonomous-database": ociAutonomousDatabaseIcon,
  "oci-load-balancer": ociLoadBalancerIcon,
  "oci-oke": ociOkeIcon,
  "oci-iam": ociIamIcon,
  "oci-functions": ociFunctionsIcon,
  "oci-api-gateway": ociApiGatewayIcon,
  "oci-block-storage": ociBlockStorageIcon,
  "oci-dns": ociDnsIcon,
  "oci-waf": ociWafIcon,
  "oci-monitoring": ociMonitoringIcon,
  "oci-container-registry": ociContainerRegistryIcon,
  "oci-exadata": ociExadataIcon,
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
  "proglang-apl": proglangAplIcon,
  "proglang-ballerina": proglangBallerinaIcon,
  "proglang-c": proglangCIcon,
  "proglang-clojure": proglangClojureIcon,
  "proglang-clojurescript": proglangClojureScriptIcon,
  "proglang-cpp": proglangCppIcon,
  "proglang-csharp": proglangCsharpIcon,
  "proglang-erlang": proglangErlangIcon,
  "proglang-fsharp": proglangFsharpIcon,
  "proglang-go": proglangGoIcon,
  "proglang-haskell": proglangHaskellIcon,
  "proglang-jule": proglangJuleIcon,
  "proglang-nim": proglangNimIcon,
  "proglang-objectivec": proglangObjectiveCIcon,
  "proglang-perl": proglangPerlIcon,
  "proglang-purescript": proglangPureScriptIcon,
  "proglang-python": proglangPythonIcon,
  "proglang-ruby": proglangRubyIcon,
  "proglang-swift": proglangSwiftIcon,
  "proglang-vala": proglangValaIcon,
  "proglang-vyper": proglangVyperIcon,
  "proglang-zig": proglangZigIcon,
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
