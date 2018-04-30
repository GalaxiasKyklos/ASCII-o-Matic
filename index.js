const asciify = require('asciify-image')
const fs = require('fs')
const {
  S3
} = require('aws-sdk')

const asciifyImg = async (image, width = 100, height = 100) => {
  try {
    const options = {
      color: false,
      fit: 'box',
      height,
      width,
    }
    return await asciify(image, options)
  } catch (e) {
    return e
  }
}

const uploadToS3 = async (s3, fileName, buffer) => {
  const params = {
    Bucket: 'upload.asciify.galaxiaskyklos.com',
    Key: fileName.replace(' ', ''),
    Body: buffer,
    ACL: 'public-read',
  }
  await s3.putObject(params).promise()
  return {
    key: params.Key,
    bucket: params.Bucket,
  }
}

const deleteFromS3 = async (s3, fileName) => {
  const params = {
    Bucket: 'upload.asciify.galaxiaskyklos.com',
    Key: fileName.replace(' ', ''),
  }
  await s3.deleteObject(params).promise()
}

const getBuffer = (image) => {
  const base64Data = image
    .replace('data:image/png;base64,', '')
    .replace('data:image/jpg;base64,', '')
    .replace('data:image/jpeg;base64,', '')
  const buffer = new Buffer(base64Data, 'base64')
  return buffer
}

exports.handler = async (event) => {
  const {
    fileName,
    height,
    image,
    url,
    width,
  } = event
  try {
    let imgUrl
    let s3
    if (url) {
      imgUrl = url
    } else {
      s3 = new S3()
      const s3Info = await uploadToS3(s3, fileName, getBuffer(image))
      imgUrl = `https://s3.us-east-2.amazonaws.com/${s3Info.bucket}/${s3Info.key}`
    }
    const result = await asciifyImg(imgUrl, width, height)
    if (!url) {
      await deleteFromS3(s3, fileName)
    }
    return result
  } catch (e) {
    return e
  }
}
