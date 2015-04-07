<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\Controller\BaseController;
use AppBundle\Entity\User;
use AppBundle\Form\UserType;

/**
 * User controller.
 *
 * @Route("/user")
 */
class UserController extends BaseController
{

    /**
     * Lists all User entities.
     *
     * @Route("/list/{page}/{orderBy}/{ascending}", name="admin_user", defaults={"page": 0, "orderBy": "id", "ascending": false})
     * @Method("GET")
     * @Template()
     */
    public function indexAction($page, $orderBy, $ascending)
    {
        $em = $this->getDoctrine()->getManager();
        
        $usersPerPage = 10;
        $users = $em->getRepository('AppBundle:User')->createQueryBuilder('u')
            ->orderBy('u.'.$orderBy, $ascending ? 'asc' : 'desc')
            ->setMaxResults($usersPerPage)->setFirstResult($page * $usersPerPage)
            ->getQuery()->getResult()
        ;
        $numUsers = $em->createQueryBuilder()
            ->select('count(u)')->from('AppBundle:User', 'u')
            ->getQuery()->getSingleScalarResult()
        ;

        return array(
            'users' => $users,
            'orderBy' => $orderBy,
            'ascending' => (bool)$ascending,
            'page' => $page,
            'numPages' => ceil($numUsers / $usersPerPage),
        );
    }

    /**
     * Displays a form to create a new User entity.
     *
     * @Route("/new", name="admin_user_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction(Request $request)
    {
        $user = new User();
        
        $form = $this->createForm(new UserType(), $user, array(
            'action' => $this->generateUrl('admin_user_create'),
            'method' => 'POST',
        ));
        $form->add('submit', 'submit', ['label' => 'Create', 'attr' => ['class' => 'btn-primary']]);
        
        $form->handleRequest($request);
        if ($form->isValid()) {
            if ($user->getPlainPassword()) {
                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $user->getPlainPassword());
                $user->setPassword($encoded);
            }
            
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_user'));
        }

        return array(
            'user' => $user,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a new User entity.
     *
     * @Route("/", name="admin_user_create")
     * @Method("POST")
     * @Template("AppBundle:User:new.html.twig")
     */
    public function createAction(Request $request)
    {
        return $this->newAction($request);
    }

    /**
     * Finds and displays a User entity.
     *
     * @Route("/{id}", name="admin_user_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository('AppBundle:User')->find($id);
        $this->checkExists($user);

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'user'      => $user,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing User entity.
     *
     * @Route("/{id}/edit", name="admin_user_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository('AppBundle:User')->find($id);
        $this->checkExists($user);

        $form = $this->createForm(new UserType(), $user, array(
            'action' => $this->generateUrl('admin_user_update', array('id' => $user->getId())),
            'method' => 'PUT',
        ));
        $form->add('submit', 'submit', ['label' => 'Opslaan', 'attr' => ['class' => 'btn-primary']]);

        $deleteForm = $this->createDeleteForm($id);
        
        $form->handleRequest($request);
        if ($form->isValid()) {
            if ($user->getPlainPassword()) {
                $encoder = $this->container->get('security.password_encoder');
                $encoded = $encoder->encodePassword($user, $user->getPlainPassword());
                $user->setPassword($encoded);
            }
            $em->flush();

            return $this->redirect($this->generateUrl('admin_user_edit', array('id' => $id)));
        }

        return array(
            'user' => $user,
            'form' => $form->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing User entity.
     *
     * @Route("/{id}", name="admin_user_update")
     * @Method("PUT")
     * @Template("AppBundle:User:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        return $this->editAction($request, $id);
    }

    /**
     * Deletes a User entity.
     *
     * @Route("/{id}", name="admin_user_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository('AppBundle:User')->find($id);
            $this->checkExists($user);

            $em->remove($user);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_user'));
    }

    /**
     * Creates a form to delete a User entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_user_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', ['label' => 'Verwijder', 'attr' => ['class' => 'btn-danger']])
            ->getForm()
        ;
    }
}
