#!/bin/bash

rm -rf public;
hugo;
aws s3 cp --recursive public s3://tommygroshong.com --cache-control max-age=500 --profile tommy;
rm .hugo_build.lock