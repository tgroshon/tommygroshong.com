# tommygroshong.com

Static blog site built with hugo.

## Commands

### Build

`$ hugo`

### Deploy

`$ ./deploy.sh`

Uses AWS CLI to copy contents of `public/` folder to an S3 bucket named
`tommygroshong.com`. Expects `tommy` AWS profile to be available and have access
to that S3 bucket.

### New Post

`$ hugo new posts/<title>.md`
