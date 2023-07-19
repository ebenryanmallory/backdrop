import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';

export const compressRoute = async (_req, res) => {
	
	const session = res.locals.shopify.session;
	const { id, shop } = session;

	const { compression } = _req.body;

	const filePath = `${process.cwd()}/images/${shop}`;
	const compressedDir = `${filePath}/compressed`;

	if (!fs.existsSync(compressedDir)) {
	  fs.mkdirSync(compressedDir);
	}
	if (compression < 10) {
		console.log('compression <= 10')
	}
	const pngCompression = { quality: [0.6, compression <= 10 ? .7 : .85] }
	await imagemin([`${filePath}/*.jpg`, `${filePath}/*.jpeg`, `${filePath}/*.png`], {
		destination: compressedDir,
		plugins: [
			imageminMozjpeg({quality: compression || 70}),
			imageminPngquant(pngCompression)
		],
    
	});
    return res.send('compressed')

  };