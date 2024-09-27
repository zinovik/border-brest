# border-brest

### create service accounts

```bash
gcloud iam service-accounts create github-actions
gcloud iam service-accounts create border-brest
```

### add roles (`Service Account User`, `Cloud Build Service Account` and `Viewer`) to the service account you want to use to deploy the cloud run

```bash
gcloud projects add-iam-policy-binding zinovik-project --member="serviceAccount:github-actions@zinovik-project.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding zinovik-project --member="serviceAccount:github-actions@zinovik-project.iam.gserviceaccount.com" --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding zinovik-project --member="serviceAccount:github-actions@zinovik-project.iam.gserviceaccount.com" --role="roles/viewer"
```

### creating keys for service account for github-actions `GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY_FILE`

```bash
gcloud iam service-accounts keys create key-file.json --iam-account=github-actions@zinovik-project.iam.gserviceaccount.com
cat key-file.json | base64
```
