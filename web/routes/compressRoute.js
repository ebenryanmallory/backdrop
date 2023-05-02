import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';

export const compressRoute = async (_req, res) => {
	
	const session = res.locals.shopify.session;
	const { id, shop } = session;
	const filePath = `${process.cwd()}/images/${shop}`;
	const compressedDir = `${process.cwd()}/images/${shop}/compressed`;
	if (!fs.existsSync(compressedDir)) {
	  fs.mkdirSync(compressedDir);
	}
	await imagemin([`${filePath}/*.jpg`, `${filePath}/*.jpeg`, 
		`${filePath}/*.png`, `${filePath}/*.gif`], {
		destination: compressedDir,
		plugins: [
			imageminMozjpeg({quality: 20})
		],
    
	});
	await imagemin([`${filePath}/*.png`], {
		destination: compressedDir,
		plugins: [
			imageminPngquant({quality: 20})
		]
	});
    return res.send('compressed')
  };