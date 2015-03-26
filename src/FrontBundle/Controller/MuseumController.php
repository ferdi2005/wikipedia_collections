<?php

namespace FrontBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Controller\BaseController;

class MuseumController extends BaseController
{
    /**
     * @Route("/museum")
     * @Template()
     */
    public function indexAction()
    {
        return [];
    }
    
    /**
     * @Route("/museum/articles", name="museum_articles", options={"expose" = true})
     */
    public function articlesAction()
    {
        $string = file_get_contents($this->get('kernel')->getRootDir() . '/../web/js/frontend/data.json');
        $json = json_decode($string, true);
        return $this->createJsonResponse($json);
    }
}
