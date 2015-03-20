<?php

namespace Frontwise\CrudBundle\Command;

use Sensio\Bundle\GeneratorBundle\Command\GenerateDoctrineCrudCommand as BaseCommand;
use Symfony\Component\HttpKernel\Bundle\BundleInterface;

class GenerateDoctrineCrudCommand extends BaseCommand {
    protected function configure()
    {
        parent::configure();
        $this
            ->setName('frontwise:generate:crud')
            ->setAliases(array())
        ;
    }
    
    protected function getSkeletonDirs(BundleInterface $bundle = null)
    {
        $sensioPath = $this->getContainer()->get('kernel')->getBundle('SensioGeneratorBundle')->getPath();
        $skeletonDirs = array(
            __DIR__.'/../Resources/skeleton',
            __DIR__.'/../Resources',
            
            $sensioPath . '/Resources/skeleton',
            $sensioPath . '/Resources',
        );
        
        return $skeletonDirs;
    }
}