module.exports = (env) => {

    const cssnano = require('cssnano')({ preset: 'default' });

    const plugins = env.mode == 'production'
        ? [
            "postcss-preset-env",
            cssnano,
            "autoprefixer",
        ] : [
            "postcss-preset-env",
            "autoprefixer",
        ];

    return {
        plugins
    }
}
