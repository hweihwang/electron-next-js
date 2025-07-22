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
    name: '@electron-forge/maker-zip',
    platforms: ['darwin']
  }],
  publishers: [{
    name: '@electron-forge/publisher-github',
    config: {
      repository: {
        owner: 'hweihwang',
        name: 'electron-next-js'
      },
      draft: false,
      prerelease: false
    }
  }]
}
