import Pocketbase from 'pocketbase'
const pb = new Pocketbase('http://localhost:8090')
pb.admins.authWithPassword('admin@email.com', 'password123')

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const run = async () => {
  await wait(1000)

  console.log('Exporting data...')

  console.log(pb.authStore.token)

  try {
    const response = await fetch('http://localhost:8090/data-export', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

run()
