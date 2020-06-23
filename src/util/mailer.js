import sgmail from '@sendgrid/mail'
import { winston } from './winston.logger'

sgmail.setApiKey(process.env.SG_API_KEY)

/**
 * This api uses sendgrid mail functionality to send mail notifications to users
 *
 * @param {to, from, subject, html} requestBody
 * request body takes 4 manadatory parameters
 *      to - { name, email }
 *      from - {name, email }
 *      subject - string
 *      html - html content
 *
 * For more options, refer - https://sendgrid.com/docs/api-reference/
 *
 */
export const mail = async requestBody => {
	try {
		return await sgmail.send(requestBody)
	} catch (error) {
		winston.debug({ src: 'mail notification error', error })
		return Promise.reject(new Error('Mail Notification failed'))
	}
}
