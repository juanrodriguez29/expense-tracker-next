const sharp = require('sharp')

const sizes = [192, 180, 32]

sizes.forEach(size => {
  sharp('public/icons/icon-512.png')
    .resize(size, size)
    .toFile(`public/icons/icon-${size}.png`, (err) => {
      if (err) console.error(err)
      else console.log(`Generated ${size}x${size}`)
    })
})