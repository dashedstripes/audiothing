export default function linear(config) {
  return {
    onCreate: async (document) => {
      console.log('WILL CREATE DOCUMENT IN LINEAR', document)
      setTimeout(() => {
        console.log('CREATED DOCUMENT IN LINEAR')
      }, 3000)
    },
  }
}
