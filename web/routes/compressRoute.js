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
	await imagemin([`${filePath}/*.jpg`, `${filePath}/*.jpeg`, `${filePath}/*.png`], {
		destination: compressedDir,
		plugins: [
			imageminMozjpeg({quality: compression || 20}),
			imageminPngquant({quality: [(compression || 20) / 100, ((compression || 20) + 5) / 100]})
		],
    
	});
    return res.send('compressed')

  };