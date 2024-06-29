import util from 'node:util';
import _ from 'lodash';

const ts = () => `${(new Date()).toISOString()} ~ `;
const output = (msg) => _.isString(msg) ? msg : util.inspect(msg);

const isTTYout = Boolean(process.stdout.isTTY);
const isTTYerr = Boolean(process.stderr.isTTY);

const labelInfo = isTTYout ? '\x1b[32m{info}\x1b[0m' : '';
const labelError = isTTYerr ? '\x1b[31m!error!\x1b[0m' : '';

function formatError(error) {
    let errorData = {};

    if (error instanceof Error) {
        errorData = _.pick(error, 'message', 'stack');
    } else {
        const message = output(error);
        errorData = { message, stack: (new Error(message)).stack };
    }

    if (error.inner) {
        errorData.inner = formatError(error.inner);
    }

    return errorData;
}

function info(msg, context) {
    const params = [ labelInfo + ts() + output(msg) ];

    if (context) {
        params.push(util.inspect(context));
    }

    params.push('');
    console.log(params.join(''));
}

function errorFn(error, context) {
    let { message, stack, inner } = formatError(error);

    message = labelError + ts() + message;
    const params = [ message, stack ];

    if (inner) {
        params.push(`Inner Error: ${inner.message}`);
        params.push(inner.stack);
    }

    if (context) { params.push(util.inspect(context)); }

    params.push('');
    console.error(params.join('\n'));
}

export default { error: errorFn, info };
