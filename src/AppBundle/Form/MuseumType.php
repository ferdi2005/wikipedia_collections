<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class MuseumType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('articles', 'collection', array(
                'label' => 'Wikipedia artikelen',
                'attr' => ['class' => 'articles'],
                'type' => new ArticleType(),
                'options'  => [
                    'attr' => ['class' => 'article'],
                    'cascade_validation' => true,
                ],
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
                'by_reference' => false,
                'cascade_validation' => true,
            ))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Museum'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'appbundle_museum';
    }
}
