import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path'

export const removeRoute = async (_req, res) => {
	const inputPath = `${process.cwd()}/app-icon.jpeg`;
	const formData = new FormData();
	formData.append('size', 'auto');
	formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

	axios({
		method: 'post',
		url: 'https://api.remove.bg/v1.0/removebg',
		data: formData,
		responseType: 'arraybuffer',
		headers: {
		  ...formData.getHeaders(),
		  'X-Api-Key': process.env.REMOVE_API,
		},
		encoding: null
	  })
	  .then((response) => {
		if(response.status != 200) return console.error('Error:', response.status, response.statusText);
		fs.writeFileSync("no-bg.png", response.data);
	  })
	  .catch((error) => {
		  return console.error('Request failed:', error);
	  });
  };