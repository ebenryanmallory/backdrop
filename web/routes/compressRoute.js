import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';

export const compressRoute = async (_req, res) => {
	await imagemin(['images/*.jpeg'], {
		destination: 'images/build',
		plugins: [
			imageminMozjpeg()
		],
    
	});
    return res.send('compressed')
  };