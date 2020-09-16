<?php

namespace Drupal\rr_react_app\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'ReactStarterBlock' block.
 *
 * @Block(
 *  id = "remedy_rater_block",
 *  admin_label = @Translation("Remedy Rater Block"),
 * )
 */
class RemedyRaterBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    $build = [];
    // Creates the element we will be rendering the react app into.
    $build['remedy_rater_block'] = [
      '#markup' => '<div id="rr_app">Loading...</div>',
      '#attached' => [
        'library' => ['rr_react_app/react', 'rr_react_app/rrreact'],
      ],
    ];

    return $build;
  }

}
