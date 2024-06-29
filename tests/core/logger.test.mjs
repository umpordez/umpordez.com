import logger from '../../core/logger.mjs';
import '../setup.mjs';

describe('logger', () => {
    it('just hangs on, keep working, don explode? :P', () => {
        logger.info('helloo');
        logger.error('world');
        logger.info('all done, right!');
        logger.info('thats it!');
    });
});
