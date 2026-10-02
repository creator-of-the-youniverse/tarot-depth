import React from 'react';
import { CardInSpread, CardOrientation } from '../types';
import { TarotCardView } from './TarotCardView';

interface SpreadLayoutProps {
  spreadId: string;
  cardsInSpread: CardInSpread[];
  flippedIndices: boolean[];
  onFlipCard?: (index: number) => void;
  onToggleOrientation?: (index: number) => void;
  cardSize?: 'sm' | 'md' | 'lg';
  deckStyle?: string;
}

export const SpreadLayout: React.FC<SpreadLayoutProps> = ({
  spreadId,
  cardsInSpread,
  flippedIndices,
  onFlipCard,
  onToggleOrientation,
  cardSize = 'md',
  deckStyle = 'classic_gold'
}) => {
  // Celtic Cross special 10-card layout matrix
  if (spreadId === 'celtic_cross' && cardsInSpread.length === 10) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 px-2 flex flex-col xl:flex-row items-center justify-center gap-8">
        {/* Left Matrix: Cards 1 through 6 */}
        <div className="relative w-full max-w-xl h-[600px] flex items-center justify-center bg-[#0b0c10]/50 rounded-2xl border border-gold-subtle p-4">
          {/* Card 1: Core Heart (Center) */}
          <div className="absolute z-10">
            <TarotCardView
              card={cardsInSpread[0].card}
              positionName={cardsInSpread[0].positionName}
              orientation={cardsInSpread[0].orientation}
              isFlipped={flippedIndices[0]}
              onFlip={() => onFlipCard && onFlipCard(0)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(0) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>

          {/* Card 2: The Crossing (Rotated overlay center) */}
          <div className="absolute z-20 opacity-90 scale-95 rotate-90">
            <TarotCardView
              card={cardsInSpread[1].card}
              positionName={cardsInSpread[1].positionName}
              orientation={cardsInSpread[1].orientation}
              isFlipped={flippedIndices[1]}
              onFlip={() => onFlipCard && onFlipCard(1)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(1) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>

          {/* Card 3: The Root (Below center) */}
          <div className="absolute bottom-4">
            <TarotCardView
              card={cardsInSpread[2].card}
              positionName={cardsInSpread[2].positionName}
              orientation={cardsInSpread[2].orientation}
              isFlipped={flippedIndices[2]}
              onFlip={() => onFlipCard && onFlipCard(2)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(2) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>

          {/* Card 4: Recent Past (Left of center) */}
          <div className="absolute left-4">
            <TarotCardView
              card={cardsInSpread[3].card}
              positionName={cardsInSpread[3].positionName}
              orientation={cardsInSpread[3].orientation}
              isFlipped={flippedIndices[3]}
              onFlip={() => onFlipCard && onFlipCard(3)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(3) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>

          {/* Card 5: The Crown (Above center) */}
          <div className="absolute top-4">
            <TarotCardView
              card={cardsInSpread[4].card}
              positionName={cardsInSpread[4].positionName}
              orientation={cardsInSpread[4].orientation}
              isFlipped={flippedIndices[4]}
              onFlip={() => onFlipCard && onFlipCard(4)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(4) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>

          {/* Card 6: Immediate Future (Right of center) */}
          <div className="absolute right-4">
            <TarotCardView
              card={cardsInSpread[5].card}
              positionName={cardsInSpread[5].positionName}
              orientation={cardsInSpread[5].orientation}
              isFlipped={flippedIndices[5]}
              onFlip={() => onFlipCard && onFlipCard(5)}
              onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(5) : undefined}
              size="sm"
              deckStyle={deckStyle}
            />
          </div>
        </div>

        {/* Right Staff Pillar: Cards 7 through 10 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-1 gap-4 p-4 bg-[#0b0c10]/50 rounded-2xl border border-gold-subtle">
          {[6, 7, 8, 9].map((idx) => (
            <div key={idx} className="flex flex-col items-center">
              <TarotCardView
                card={cardsInSpread[idx].card}
                positionName={cardsInSpread[idx].positionName}
                orientation={cardsInSpread[idx].orientation}
                isFlipped={flippedIndices[idx]}
                onFlip={() => onFlipCard && onFlipCard(idx)}
                onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(idx) : undefined}
                size="sm"
                deckStyle={deckStyle}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard responsive flex/grid for 1, 3, or 5 card spreads
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-6">
      {cardsInSpread.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <TarotCardView
            card={item.card}
            positionName={item.positionName}
            positionDescription={item.positionDescription}
            orientation={item.orientation}
            isFlipped={flippedIndices[index]}
            onFlip={() => onFlipCard && onFlipCard(index)}
            onToggleOrientation={onToggleOrientation ? () => onToggleOrientation(index) : undefined}
            size={cardsInSpread.length === 1 ? 'lg' : cardSize}
            deckStyle={deckStyle}
          />
        </div>
      ))}
    </div>
  );
};
