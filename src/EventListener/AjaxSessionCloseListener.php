<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;

class AjaxSessionCloseListener
{
    public function onKernelRequest(GetResponseEvent $event)
    {
//         dump('Coucou');
        $request = $event->getRequest();

        if (!$request->isXmlHttpRequest()) {
            return;
        }

        if (!$request->attributes->has('_route')) {
            return;
        }

        $session = $request->getSession();
        $session->save();
    }
}