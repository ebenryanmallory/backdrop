import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const removeRoute = async (_req, res) => {

	const buffer = _req.files[0].buffer;

	const session = res.locals.shopify.session;
	const { id, shop } = session;
	const imagesFolder = `${process.cwd()}/images`;
	if (!fs.existsSync(imagesFolder)) {
	  fs.mkdirSync(imagesFolder);
	}
	const shopFolder = `${process.cwd()}/images/${shop}`;
	if (!fs.existsSync(shopFolder)) {
	  fs.mkdirSync(shopFolder);
	}

	const formData = new FormData();
	formData.append('size', 'auto');
	formData.append('image_file', buffer);

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
		const filePath = `${process.cwd()}/images/${shop}/${_req.body.filename}`;
		fs.writeFileSync(filePath, response.data);
		return res.send(_req.body.filename);
	  })
	  .catch((error) => {
		  return res.send({error : error});
	  });
  };