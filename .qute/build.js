import path from 'path';
import qute from '@qutejs/rollup-plugin-qute'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'
import devServer from 'rollup-plugin-koa-devserver'

import sources from './sources.js';

import pkg from '../package.json'

const defaultDevServerPort = 8090;

function plugins(quteConfig) {
	const useBuble = quteConfig && quteConfig.web;
	return [
		qute(quteConfig),
		nodeResolve( {preferBuiltins: true} ),
		commonjs({
			include: ['**/node_modules/**', 'node_modules/**']
		}),
		useBuble && buble({
			objectAssign: 'Object.assign',
			//exclude: ['node_modules/**', '**/*.css'],
			include: ["**/*.js", "**/*.jsq"]
		})
	];
}
/**
 * The default is to generate the web component name from the package name
 * by converting the name to pascal case
 * @param {*} compName
 * @returns
 */
function makeWebComponentName(compName) {
    if (!compName) {
        let name = pkg.name;
        if (name.startsWith('@')) name = name.substring(1);
        compName = name.split(/[_\/-]/).map(part => part[0].toUpperCase()+part.substring(1)).join('');
    }
    return compName;
}

/**
 * The default is to use ${package.name}-${package.version}[.min].js
 * @param {*} baseName
 * @param {*} minimize
 * @returns
 */
function makeWebFileName(baseName, minimize) {
    if (!baseName) {
        let name = pkg.name;
        if (name.startsWith('@')) name = name.substring(1);
        baseName = name.replace(/[_\/]/g, '-')+'-'+pkg.version;
    }
    return baseName+(minimize?'.min.js':'.js');
}

export default class BuildConfig {
    /**
     * Create a build config instance. All options are optinals
     * opts.componentName - use this as the rollup output.name for the web build. The default is a pascal case identifier generated from the package name.
     * opts.moduleName - use this to construct the output file for the web build:`${moduleName}.min.js`. The default is a kebab case identifier  generated from package name and version.
     * devServerPort - used by the dev build. Default is 8090
     * External and globals are generated by qute plugin.
     *
     * @param {Object} opts
     */
    constructor(opts = {}) {
        this.opts = opts;
        if (isNaN(opts.devServerPort)) {
            this.devServerPort = defaultDevServerPort;
        } else if (!opts.devServerPort) {
            // if port is 0 we disable the dev server
            this.devServerPort = void(0);
        } else {
            this.devServerPort = opts.devServerPort;
        }
    }
    /**
     * Builds the web artifacts
     * If opts.web.minimize is true then compress js and css files.
     * @param {*} opts - qute plugin options
     * @returns rollup configuration
     */
    web(opts = {}) {
        const minimize = opts.web && opts.web.minimize;
        return {
            input: './src/index.js',
            output: {
                name: makeWebComponentName(this.opts.componentName),
                file: path.join('dist', makeWebFileName(this.opts.moduleName, minimize)),
                format: 'iife',
                sourcemap: true,
                plugins: [
                    minimize && terser()
                ]
            },
            plugins: plugins({web:true, ...opts})
        }
    }

    //
    /**
     * Build an `esm` distribution folder (so the package can be used as a dependency by other packages)
     * @param {*} opts - qute plugin options
     * @returns
     */
    lib(opts = {}) {
        const dist = opts.dist || 'dist';
        return {
            input: sources(),
            output: {
                dir: dist+'/esm',
                format: 'esm',
                sourcemap: true
            },
            plugins: plugins({web:false, ...opts})
        };
    }

    /**
     * A build which starts a dev server - to be used with npm start
     * @param {*} opts - options to be passed to qute plugin
     * @returns rollup configuration
     */
    dev(opts = {}) {
        const devServerPort = this.devServerPort;
        const componentName = this.opts.devComponentName || 'MyDevComponent';
        // globals and external are automatically configured by the qute plugin.
        // You can specify your own globals if needed.
        // To change the `external` property it is recommended to use an `external` function
        // passed to qute config. Ex: qute({external: (id) => ..., web:true})
        // This function must return null or undefined to let qute use the default value for the given id
        return {
            input: './src/index.js',
            output: {
                name: componentName,
                file: './.qute/build/dev-bundle.js',
                format: 'iife',
                sourcemap: true
            },
            plugins: [
                ...plugins({web:true, ...opts}),
                devServerPort && devServer({
                    port: devServerPort,
                    root: '.qute',
                    open: '/index.html',
                    livereload: {
                        watch: './qute'
                    }
                })
            ]
        };
    }
    /**
     * Builds a single file containing all tests - to be used by npm test
     * Uses @rollup/plugin-multi-entry under the hood.
     * If no testFiles are specified the default pattern is used: `./test/**\/*-test.js?(q)``
     * @returns a rollup configuration
     * @param {*} testFiles - a glob or array to specify the test files. The format is the same of the rollup.input property used by @rollup/plugin-multi-entry
     * @returns
     */
    test(testFiles) {
        return {
            input: testFiles || './test/**/*-test.js?(q)',
            output: {
                file: './.qute/build/test-bundle.js',
                format: 'esm',
                sourcemap: true
            },
            plugins: plugins({test:true})
        }
    }
}
