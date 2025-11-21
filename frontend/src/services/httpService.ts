import axios from 'axios'

export async function getAxios() {
  const response = await axios.get('config.json') //? Cargar el archivo JSON

  return axios.create({
    baseURL: response.data.url, //? Establecer baseURL desde el archivo JSON
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
