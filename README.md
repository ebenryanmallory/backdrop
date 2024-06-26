# Backdrop - Shopify App for Background Removal

Backdrop is a Shopify App that allows users to easily remove backgrounds from images using an API. This app simplifies the process of editing product images, making it easier for store owners to create professional-looking product photos.

![Backdrop App Screenshot](Backdrop-Listing.jpg)

## Features

- Simple and intuitive user interface
- Utilizes an API for background removal
- Professional quality background removal and image compression for product photography

## Installation

As the app has been shut down permanently and is not currently live, installation is not possible. The code in this repository demonstrates how the app is structured and how it interacts with the Shopify API. Feel free to use for guidance or as a building block to make your own app!

## Technologies Used

- Shopify API
- Background removal API using https://www.remove.bg/
- Fly.io for hosting and deployment

## Project Structure

The project is organized as follows:

```
backdrop/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── ...
├── public/
├── .env
├── fly.toml
├── package.json
└── ...
```

- `src/`: Contains the main source code for the app
  - `components/`: Reusable components used throughout the app
  - `pages/`: Page components representing different views of the app
  - `utils/`: Utility functions and helper modules
- `public/`: Public assets and static files
- `.env`: Environment variables for configuration (not included in the repository)
- `fly.toml`: Configuration file for deploying the app on Fly.io
- `package.json`: Project dependencies and scripts

## Contributing

As this is a personal project, contributions are not currently accepted. However, feel free to fork the repository and experiment with the code for your own learning purposes.

## License

This project is licensed under the [MIT License](LICENSE).