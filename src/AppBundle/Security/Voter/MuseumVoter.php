<?php
namespace AppBundle\Security\Voter;

use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class MuseumVoter implements VoterInterface
{
    const VIEW = 'view';
    const EDIT = 'edit';
    const DELETE = 'delete';

    public function supportsAttribute($attribute)
    {
        return in_array($attribute, array(
            self::VIEW,
            self::EDIT,
            self::DELETE,
        ));
    }

    public function supportsClass($class)
    {
        $supportedClass = 'AppBundle\Entity\Museum';

        return $supportedClass === $class || is_subclass_of($class, $supportedClass);
    }

    /**
     * @var \AppBundle\Entity\Museum $museum
     */
    public function vote(TokenInterface $token, $museum, array $attributes)
    {
        if (!$this->supportsClass(get_class($museum))) {
            return VoterInterface::ACCESS_ABSTAIN;
        }
        
        // get current logged in user
        $user = $token->getUser();

        if (in_array('ROLE_SUPER_ADMIN', $user->getRoles())) {
            return VoterInterface::ACCESS_GRANTED;
        }

        // set the attribute to check against
        $attribute = $attributes[0];

        // check if the given attribute is covered by this voter
        if (!$this->supportsAttribute($attribute)) {
            return VoterInterface::ACCESS_ABSTAIN;
        }


        // make sure there is a user object (i.e. that the user is logged in)
        if (!$user instanceof UserInterface) {
            return VoterInterface::ACCESS_DENIED;
        }

        switch($attribute) {
            case self::VIEW:
            case self::EDIT:
                if ($user->getMuseum()->getId() === $museum->getId()) {
                    return VoterInterface::ACCESS_GRANTED;
                }
                break;
            case self::DELETE:
                return VoterInterface::ACCESS_DENIED; // Only super_admin can delete
                break;
        }

        return VoterInterface::ACCESS_DENIED;
    }
}