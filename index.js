const asciify = require('asciify-image')
const fs = require('fs')
const { S3 } = require('aws-sdk')
 
const options = {
  fit:    'box',
  width:  100,
  height: 40,
  color: false,
}

const asciifyImg = async (image) => {
  try {
    return await asciify('./logo.jpg', options)
  } catch (e) {
    return e
  }
} 

exports.handler = async (event) => {
  const { image, fileName } = event
  const base64Data = image.replace(/^data:image\/png;base64,/, '')
  const buffer = new Buffer(base64Data, 'base64')
  const params = {
    Bucket: 'upload.asciify.galaxiaskyklos.com',
    Key: fileName,
    Body: buffer,
    Region: 'us-east-2'
  }
  const s3 = new S3()
  try {
    await s3.putObject(params).promise()
    const result = await asciifyImg(`https://s3-us-east-2.amazonaws.com/${fileName}`)
    await s3.deleteObject(params).promise()
    return result
  } catch (e) {
    return e
  }
}
