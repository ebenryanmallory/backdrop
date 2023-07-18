import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const removeRoute = async (_req, res) => {

	const session = res.locals.shopify.session;
	const { id, shop } = session;
	const buffer = _req.files[0].buffer;
	const { filename, bg_color, use_transparency, plan_type } = _req.body;

	const imagesFolder = `${process.cwd()}/images`;
	if (!fs.existsSync(imagesFolder)) {
		fs.mkdirSync(imagesFolder);
	}
	const shopFolder = `${process.cwd()}/images/${shop}`;
	if (!fs.existsSync(shopFolder)) {
		fs.mkdirSync(shopFolder);
	}

	const formData = new FormData();
	formData.append('image_file', buffer);
	formData.append('format', use_transparency === 'true' ? 'png' : 'jpg'); // 'auto
	if (use_transparency === 'false') {
		formData.append('bg_color', bg_color.replace('#', ''));
		console.log(bg_color.replace('#', ''))
	}
	formData.append('size', (plan_type === 'professional') || (plan_type === 'studio') ? 'auto' : 'preview'); 
	// 'full', auto is full with fallback if account runs low on credits
	formData.append('crop', 'true');
	formData.append('crop_margin', '10% 10% 10% 10%');
	// formData.append('scale', '90%');

	const removeBGresponse = await axios({
		method: 'post',
		url: 'https://api.remove.bg/v1.0/removebg',
		data: formData,
		responseType: 'arraybuffer',
		headers: {
		  ...formData.getHeaders(),
		  'X-Api-Key': process.env.REMOVE_API
		}
	}).catch((error) => {
		console.log(error)
		return res.send(error)
	})
	const filePath = `${process.cwd()}/images/${shop}/${filename}`;
	const axiosBuffer = Buffer.from(removeBGresponse.data, 'binary');

	await fs.promises.writeFile(filePath, axiosBuffer);
	return res.send({ filename: _req.body.filename });
  };