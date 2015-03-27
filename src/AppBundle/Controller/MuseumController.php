<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Controller\BaseController;
use AppBundle\Entity\Museum;
use AppBundle\Form\MuseumType;

/**
 * Museum controller.
 *
 * @Route("/museum")
 */
class MuseumController extends BaseController
{

    /**
     * Lists all Museum entities.
     *
     * @Route("/list/{page}/{orderBy}/{ascending}", name="museum", defaults={"page": 0, "orderBy": "id", "ascending": false})
     * @Method("GET")
     * @Template()
     */
    public function indexAction($page, $orderBy, $ascending)
    {
        $em = $this->getDoctrine()->getManager();
        
        $museumsPerPage = 10;
        $museums = $em->getRepository('AppBundle:Museum')->createQueryBuilder('m')
            ->orderBy('m.'.$orderBy, $ascending ? 'asc' : 'desc')
            ->setMaxResults($museumsPerPage)->setFirstResult($page * $museumsPerPage)
            ->getQuery()->getResult()
        ;
        $numMuseums = $em->createQueryBuilder()
            ->select('count(m)')->from('AppBundle:Museum', 'm')
            ->getQuery()->getSingleScalarResult()
        ;

        return array(
            'museums' => $museums,
            'orderBy' => $orderBy,
            'ascending' => (bool)$ascending,
            'page' => $page,
            'numPages' => ceil($numMuseums / $museumsPerPage),
        );
    }

    /**
     * Displays a form to create a new Museum entity.
     *
     * @Route("/new", name="museum_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction(Request $request)
    {
        $museum = new Museum();
        
        $form = $this->createForm(new MuseumType(), $museum, array(
            'action' => $this->generateUrl('museum_create'),
            'method' => 'POST',
        ));
        $form->add('submit', 'submit', ['label' => 'Create', 'attr' => ['class' => 'btn-primary']]);
        
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($museum);
            $em->flush();

            return $this->redirect($this->generateUrl('museum'));
        }

        return array(
            'museum' => $museum,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a new Museum entity.
     *
     * @Route("/", name="museum_create")
     * @Method("POST")
     * @Template("AppBundle:Museum:new.html.twig")
     */
    public function createAction(Request $request)
    {
        return $this->newAction($request);
    }

    /**
     * Finds and displays a Museum entity.
     *
     * @Route("/{id}", name="museum_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $museum = $em->getRepository('AppBundle:Museum')->find($id);
        $this->checkExists($museum);

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'museum'      => $museum,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Museum entity.
     *
     * @Route("/{id}/edit", name="museum_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $museum = $em->getRepository('AppBundle:Museum')->find($id);
        $this->checkExists($museum);

        $form = $this->createForm(new MuseumType(), $museum, array(
            'action' => $this->generateUrl('museum_update', array('id' => $museum->getId())),
            'method' => 'PUT',
        ));
        $form->add('submit', 'submit', ['label' => 'Update', 'attr' => ['class' => 'btn-primary']]);

        $deleteForm = $this->createDeleteForm($id);
        
        $origArticles = clone $museum->getArticles();
        
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em->flush();
            
            $origArticles
                ->filter(function($a) use ($museum) { return !$museum->getArticles()->contains($a); })
                ->map(function ($a) use ($em) { $em->remove($a); })
            ;
            $em->flush();

            return $this->redirect($this->generateUrl('museum_edit', array('id' => $id)));
        }

        return array(
            'museum' => $museum,
            'form' => $form->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Museum entity.
     *
     * @Route("/{id}", name="museum_update")
     * @Method("PUT")
     * @Template("AppBundle:Museum:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        return $this->editAction($request, $id);
    }

    /**
     * Deletes a Museum entity.
     *
     * @Route("/{id}", name="museum_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $museum = $em->getRepository('AppBundle:Museum')->find($id);
            $this->checkExists($museum);

            $em->remove($museum);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('museum'));
    }

    /**
     * Creates a form to delete a Museum entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('museum_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', ['label' => 'Delete', 'attr' => ['class' => 'btn-danger']])
            ->getForm()
        ;
    }
}
