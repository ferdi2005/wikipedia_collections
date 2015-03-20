<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class BaseController extends Controller {

    /**
     *  Flash notice message
     */
    protected function flashNotice($message, $parameters = array(), $domain = null) {
        $this->get('session')->getFlashBag()->add(
            'notice', $this->get('translator')->trans($message, $parameters, $domain)
        );
    }
    
    /**
     *  Flash error message
     */    
    protected function flashError($message, $parameters = array(),  $domain = null) {
        $this->get('session')->getFlashBag()->add(
            'error', $this->get('translator')->trans($message, $parameters, $domain)
        );
    }

    protected function createJsonResponse(Array $data, $httpStatusCode = 200) {
        return new Response(
            json_encode($data, JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES), 
            $httpStatusCode,
            array('Content-type' => 'application/json')
        );
    }

    /**
     * Check if passed variable is not falsy, throws exception otherwise
     * @throws NotFoundHttpException If !$entity
     */
    protected function checkExists($entity, $errorMessage = 'Unable to find entity.') {
        if (!$entity) {
            throw $this->createNotFoundException($errorMessage);
        }
        return $entity;
    }
    
    /**
     * Output file to browser.
     * 
     * @param  string $filename         File to stream to user
     * @param  string $browserFilename  Filename the user sees
     * @param  array $contentType       File mime type, i.e. 'application/csv'
     * @return Response
     */
    protected function createFileResponse($filename, $browserFilename = null, $contentType = null) {
        if (!file_exists($filename)) {
            return new Response('File not found', 404);
        }
        
        if ($browserFilename === null) {
            $browserFilename = basename($filename);
        }
        if ($contentType === null) {
            // Try to guess mime/content type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $contentType = finfo_file($finfo, $filename);
            finfo_close($finfo);
        }
        
        $response = new Response();
        $response->setStatusCode(200);
        if ($contentType) {
            $response->headers->set('Content-Type', $contentType);
        }
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$browserFilename.'"');
        $response->setContent(file_get_contents($filename));

        // Prints the HTTP headers followed by the content
        return $response;
    }

    /**
     * Send email.
     * 
     * @param  string $to             Email address to send to
     * @param  string $subject        Subject of the email
     * @param  string $template       Shorthand notation for string location
     * @param  array  $templateParams Parameters to pass to the template to render
     * @return integer                The number of recipients who were accepted for delivery.
     */
    public function sendMail($to, $subject, $template, array $templateParams) {
        $body = $this->renderView($template, $templateParams);
        
        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom($this->container->getParameter('email_from_address'), $this->container->getParameter('email_from_name'))
            ->setTo($to)
            ->setBody($body, 'text/html')
            ->addPart(strip_tags($body), 'text/plain')
        ;
        
        return $this->get('mailer')->send($message);
    }
    
    /**
     * Create a form with method set to put, and only a single button in t.
     * Can be used instead of links for write actions that should be protected against CSRF attacks.
     * 
     * You might want to use the CircleBundle:Form:_singleButton.html.twig partial to render the form.
     * 
     * @param string $url The url the form should point to.
     * @param string $label The label for the submit button.
     */
    protected function createPutForm($url = null, $label = 'Go', $options = [])
    {
        $fb = $this->createFormBuilder(null, array(
            'action' => $url,
            'method' => 'PUT',
        ));
        
        $options['label'] = $label;

        $fb->add('submit', 'submit', $options);

        return $fb->getForm();
    }
}