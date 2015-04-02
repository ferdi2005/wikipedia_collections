<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ArticleType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        
        $builder
            ->add('title')
            ->add('pageId')
            ->add('language')
            ->add('plainContent')
            ->add('imageTitle')
            ->add('smallImage')
            ->add('largeImage')
            ->add('position')
            // ->add('translations', 'collection', array(
            //     'attr' => ['class' => 'translations'],
            //     'type' => new TranslationType(),
            //     'options'  => [
            //         'attr' => ['class' => 'translation'],
            //         'cascade_validation' => true,
            //     ],
            //     'allow_add' => true,
            //     'allow_delete' => true,
            //     'prototype' => true,
            //     'by_reference' => false,
            //     'cascade_validation' => true,
            // ))
        ;
    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Article'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'appbundle_article';
    }
}
