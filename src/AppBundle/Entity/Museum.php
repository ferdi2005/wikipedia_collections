<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use JsonSerializable;

/**
 * Museum
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Museum implements JsonSerializable
{
    public static $DEFAULT_LANGUAGES = [
        'nl' => 'Nederlands',
        'en' => 'English',
        'sv' => 'Svenska',
        'de' => 'Deutsch',
        'fr' => 'Français',
        'it' => 'Italiano',
        'es' => 'Español',
    ];
    
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank
     */
    private $name;
    
    /**
     * @var Article
     * @ORM\OneToMany(targetEntity="Article", mappedBy="museum", cascade={"persist", "remove"})
     * @ORM\OrderBy({ "position" = "asc" })
     * @Assert\Valid
     */
    private $articles;
    
    /**
     * @var string
     *
     * @ORM\Column(type="string", length=31)
     * @Assert\NotBlank
     */
    private $defaultLanguage;
    
    /* ============== Utility ============== */
    
    public function __construct() {
        $this->articles = new ArrayCollection();
    }
    
    public function __toString() {
        return $this->name;
    }
    
    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'articles' => $this->articles->toArray(),
            'defaultLanguage' => $this->defaultLanguage,
        ];
    }
    
    /* ============== Accessors ============== */

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Museum
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Add articles
     *
     * @param \AppBundle\Entity\Article $articles
     * @return Museum
     */
    public function addArticle(\AppBundle\Entity\Article $articles)
    {
        if ($articles) {
            $articles->setMuseum($this);
        }
        $this->articles[] = $articles;

        return $this;
    }

    /**
     * Remove articles
     *
     * @param \AppBundle\Entity\Article $articles
     */
    public function removeArticle(\AppBundle\Entity\Article $articles)
    {
        if ($articles) {
            $articles->setMuseum(null);
        }
        $this->articles->removeElement($articles);
    }

    /**
     * Get articles
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getArticles()
    {
        return $this->articles;
    }

    /**
     * Set defaultLanguage
     *
     * @param string $defaultLanguage
     * @return Museum
     */
    public function setDefaultLanguage($defaultLanguage)
    {
        $this->defaultLanguage = $defaultLanguage;

        return $this;
    }

    /**
     * Get defaultLanguage
     *
     * @return string 
     */
    public function getDefaultLanguage()
    {
        return $this->defaultLanguage;
    }
}
