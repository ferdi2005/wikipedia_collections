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
    private $output;
    private $indentation = 0;
    
    protected function configure()
    {
        $this
            ->setName('app:wiki:download_translations')
            ->setDescription('Download translations for an article, or all articles in a museum')
            ->addOption('articleId', 'a',  InputOption::VALUE_OPTIONAL)
            ->addOption('museumId', 'm',  InputOption::VALUE_OPTIONAL)
            ->addOption('redownload', null,  InputOption::VALUE_NONE, 'When specified, even already existing translations are downloaded again.')
            ->setAliases(array())
        ;
    }
    
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->output = $output;
        
        $em = $this->getContainer()->get('doctrine')->getManager();
        $mr = $em->getRepository('AppBundle:Museum');
        
        $articleId = $input->getOption('articleId');
        $museumId = $input->getOption('museumId');
        
        if ($articleId) {
            $this->downloadTranslations($articleId, $input, $output);
        } else if ($museumId) {
            $museum = $mr->find($museumId);
            if (!$museum) {
                return $this->writeln('museum not found: ' . $museumId);
            }
            foreach ($museum->getArticles() as $article) {
                $this->downloadTranslations($article->getId(), $input, $output);
            }
        } else {
            $museums = $mr->findAll();
            foreach ($museums as $museum) {
                $this->writeln("\nProcessing museum: " . $museum->getName());
                $this->indentation++;
                foreach ($museum->getArticles() as $article) {
                    $this->downloadTranslations($article->getId(), $input, $output);
                }
                $this->indentation--;
            }
        }
    }
    
    private function downloadTranslations($articleId, $input, $output) {
        $em = $this->getContainer()->get('doctrine')->getManager();
        $redownload = $input->getOption('redownload');
        $article = $em->getRepository('AppBundle:Article')->find($articleId);
        if (!$article) {
            return $this->writeln('Article not found: ' . $articleId);
        }
        
        if (count($article->getTranslations()) > 0 && !$redownload) {
            $this->writeln('Translations already downloaded: ' . $article->getTitle());
        } else {
            $this->writeln('Downloading translations for: ' . $article->getTitle());
            
            // Delete old translations
            foreach ($article->getTranslations() as $translation) {
                $article->removeTranslation($translation);
                $em->remove($translation);
            }
            
            $langlinks = Wikipedia::getLangLinks($article->getLanguage(), $article->getTitle());
            if (!$langlinks) {
                $this->writeln("\tError downloading langlinks for " . $article->getTitle());
            } else {
                $this->indentation++;
                foreach ($langlinks as $langlink) {
                    $this->writeln("Downloading " . $langlink['lang']);
                    
                    $data = Wikipedia::getArticle($langlink['lang'], $langlink['*']);
                    if (!$data) { continue; }
                    
                    $translation = (new Article())
                        ->setLanguage($langlink['lang'])
                        ->setFromData($data)
                    ;
                    
                    $article->addTranslation($translation);
                    
                    $em->persist($translation);
                }
                $this->indentation--;
                
                $em->flush();
            }
        }
        
        $this->indentation++;
        foreach ($article->getRelated() as $relation) {
            $this->downloadTranslations($relation->getId(), $input, $output);
        }
        $this->indentation--;
    }
    
    private function writeln($msg) {
        $this->output->writeln(str_repeat("\t", $this->indentation) . $msg);
    }
}