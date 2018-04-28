const asciify = require('asciify-image')
const fs = require('fs')
 
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

// asciifyImg()

exports.handler = async (event) => {
  const image = event.image
  const base64Data = image.replace(/^data:image\/png;base64,/, '')
  const binaryData = new Buffer(base64Data, 'base64').toString('binary')
  fs.writeFileSync('out.jpg', binaryData)
  return await asciifyImg('out.jpg')
}
