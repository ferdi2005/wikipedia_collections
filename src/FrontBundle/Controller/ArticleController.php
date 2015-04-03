<?php

namespace FrontBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Controller\BaseController;
use AppBundle\Helper\Wikipedia;
use AppBundle\Entity\Article;

class ArticleController extends BaseController
{
    
    /**
     * @Route("/article/search/{museumId}/{language}/{query}", name="article_search", options={"expose" = true})
     * @Template()
     */
    public function showAction($museumId, $language, $query)
    {
        $em = $this->getDoctrine()->getManager();
        $museum = $em->getRepository('AppBundle:Museum')->find($museumId);
        $this->checkExists($museum);
        
        $terms = explode(' ', $query);
        
        // Gather articles with one of the terms in the title
        $articles = $this->searchArticles($museum, $language, 'title', $terms);

        // Add articles with one of the terms in the body
        $articlesBody = $this->searchArticles($museum, $language, 'plainContent', $terms);
        foreach ($articlesBody as $article) {
            if (!in_array($article, $articles)) {
                $articles[] = $article;
            }
        }

        // Limit to x results
        $articles = array_slice($articles, 0, 10);
        
        return $this->createJsonResponse(array_map(
            function($a) { return $a->getId(); }, 
            $articles
        ));
    }
    
    /**
     * Return articles that contain any of the $terms in their $attribute.
     * Archived articles __are__ shown in the search results.
     * 
     * @param  string $attribute i.e. "title"
     * @param  array  $terms     terms to search for
     */
    private function searchArticles($museum, $language, $attribute, array $terms) {
        $em = $this->getDoctrine()->getManager();

        $qb = $em->createQueryBuilder();
        $or = $qb->expr()->orx();
        $count = 1;
        foreach ($terms as $term) {
            $or->add($qb->expr()->like('a.'.$attribute, '?'.$count));
            $qb->setParameter($count, '%'.$term.'%');
            $count++;
        }
        $qb
            ->select('a')
            ->from('AppBundle:Article', 'a')
            ->leftJoin('a.translationOf', 'b')
            ->where($or)
            ->andWhere('(a.museum = :museum OR b.museum = :museum)')
            ->setParameter('museum', $museum)
            ->andWhere('a.language = :language')
            ->setParameter('language', $language)
            ->setMaxResults(10)
        ;
            
        return $qb->getQuery()->getResult(); 
    }
    
}
