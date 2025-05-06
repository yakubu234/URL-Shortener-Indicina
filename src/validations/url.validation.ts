import Joi from 'joi';

export const encodeSchema = Joi.object({
  longUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .label('Long URL')
});

export const decodeSchema = Joi.object({
  shortUrl: Joi.string().required().label('Short URL')
});
