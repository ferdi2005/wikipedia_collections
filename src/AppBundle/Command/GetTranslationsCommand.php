<?php

namespace AppBundle\Command;

use Symfony\Component\HttpKernel\Bundle\BundleInterface;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use AppBundle\Helper\Wikipedia;
use AppBundle\Entity\Article;
use AppBundle\Entity\Museum;

class GetTranslationsCommand extends ContainerAwareCommand {
    protected function configure()
    {
        $this
            ->setName('wikipedia:download_translations')
            ->setDescription('Download translations for an article, or all articles in a museum')
            ->addOption('articleId', 'a',  InputOption::VALUE_OPTIONAL)
            ->addOption('museumId', 'm',  InputOption::VALUE_OPTIONAL)
            ->addOption('redownload', null,  InputOption::VALUE_NONE, 'When specified, even already existing translations are downloaded again.')
            ->setAliases(array())
        ;
    }
    
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $em = $this->getContainer()->get('doctrine')->getManager();
        
        $articleId = $input->getOption('articleId');
        $museumId = $input->getOption('museumId');
        
        if ($articleId) {
            $this->downloadTranslations($articleId, $input, $output);
        } else if ($museumId) {
            $museum = $em->getRepository('AppBundle:Museum')->find($museumId);
            if (!$museum) {
                return $output->writeln('museum not found: ' . $museumId);
            }
            foreach ($museum->getArticles() as $article) {
                $this->downloadTranslations($article->getId(), $input, $output);
            }
        } else {
            $output->writeln('Please specify either an articleId or a museumId');
        }
    }
    
    private function downloadTranslations($articleId, $input, $output) {
        $em = $this->getContainer()->get('doctrine')->getManager();
        $redownload = $input->getOption('redownload');
        $article = $em->getRepository('AppBundle:Article')->find($articleId);
        if (!$article) {
            return $output->writeln('Article not found: ' . $articleId);
        }
        
        if (count($article->getTranslations()) > 0 && !$redownload) {
            $output->writeln('Translations already downloaded: ' . $article->getTitle());
            return;
        }
        $output->writeln('Downloading translations for: ' . $article->getTitle());
        
        // Delete old translations
        foreach ($article->getTranslations() as $translation) {
            $article->removeTranslation($translation);
            $em->remove($translation);
        }
        
        $langlinks = Wikipedia::getLangLinks($article->getLanguage(), $article->getTitle());
        if (!$langlinks) {
            $output->writeln('Error downloading langlinks for ' . $article->getTitle());
            return;
        }
        
        foreach ($langlinks as $langlink) {
            $output->writeln("\tDownloading " . $langlink['lang']);
            
            $data = Wikipedia::getArticle($langlink['lang'], $langlink['*']);
            if (!$data) { continue; }
            
            $translation = (new Article())
                ->setLanguage($langlink['lang'])
                ->setFromData($data)
            ;
            
            $article->addTranslation($translation);
            
            $em->persist($translation);
        }
        
        $em->flush();
    }
}