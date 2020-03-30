# Test partition parallelism with KafkaJS

## Run: 

```bash
docker-compose up -d
docker-compose logs -f app
```

## Check lag:

http://localhost:9000/clusters/local/consumers/CONSUMER_GROUP_ID/topic/EVENTS/type/KF
