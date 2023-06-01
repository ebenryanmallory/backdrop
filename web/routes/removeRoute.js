import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const removeRoute = async (_req, res) => {

	const session = res.locals.shopify.session;
	const { id, shop } = session;
	const buffer = _req.files[0].buffer;

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

	const removeBGresponse = await axios({
		method: 'post',
		url: 'https://api.remove.bg/v1.0/removebg',
		data: formData,
		responseType: 'arraybuffer',
		headers: {
		  ...formData.getHeaders(),
		  'X-Api-Key': '97EeePwnYjb2rZbj3sjqoyMd' // process.env.REMOVE_API
		},
		format: 'JPG', // 'ZIP', 'PNG'
		bg_color: _req.body?.bg_color || '#FFFFFF',
		encoding: null
	}).catch((error) => {
		console.log(error)
		return res.send(error)
	})
	const filePath = `${process.cwd()}/images/${shop}/${_req.body.filename}`;
	const axiosBuffer = Buffer.from(removeBGresponse.data, 'binary');

	await fs.promises.writeFile(filePath, axiosBuffer);
	return res.send(_req.body.filename);
  };