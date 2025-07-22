module.exports = {
  packagerConfig: { 
    asar: true,
    icon: './assets/icons/icon',
    extraResource: [
      'prisma/schema.prisma',
      'node_modules/.prisma',
      'node_modules/@prisma/client'
    ]
  },
  makers: [{
    name: '@electron-forge/maker-dmg',
    platforms: ['darwin'],
    config: {
      format: 'ULFO'
    }
  }],
  publishers: [{
    name: '@electron-forge/publisher-github',
    config: {
      repository: {
        owner: 'hweihwang',
        name: 'electron-next-js'
      }
    }
  }]
}
