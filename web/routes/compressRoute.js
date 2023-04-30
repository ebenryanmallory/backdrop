import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import fs from 'fs';

export const compressRoute = async (_req, res) => {
	
	const session = res.locals.shopify.session;
	const { id, shop } = session;
	const filePath = `${process.cwd()}/images/${shop}/${_req.body.filename}`;
	const compressedDir = `${process.cwd()}/images/${shop}/compressed`;
	if (!fs.existsSync(compressedDir)) {
	  fs.mkdirSync(compressedDir);
	}
	await imagemin([filePath], {
		destination: compressedDir,
		plugins: [
			imageminMozjpeg()
		],
    
	});
    return res.send('compressed')
  };