import React from 'react';
import { Card, Row, Col } from 'reactstrap';
import PropTypes from "prop-types";

const propTypes = {
  result: PropTypes.object.isRequired
}

const MatchResult = ({ result }) => {
  const durationMin = Math.trunc(result.duration / 60);
  const durationSec = result.duration - durationMin * 60;
  return (
    <Card className="MatchResult-container">
      <Row>
        <Col sm="2">
          <h3 className="text-header">Ranked Solo</h3>
          <p>{result.didWin ? "Victory" : "Defeat"}</p>
          <p>{durationMin}m {durationSec}s</p>
        </Col>
        <Col sm="4">
          <Row>
            <Col sm="6"><img src={`http://ddragon.leagueoflegends.com/cdn/9.16.1/img/champion/${result.championImg.full}`} alt="champion avatar" /></Col>
            <Col sm="6">
              <img src="http://ddragon.leagueoflegends.com/cdn/9.16.1/img/champion/Ahri.png" alt="spell" className="spell-img" />
              <img src="http://ddragon.leagueoflegends.com/cdn/9.16.1/img/champion/Ahri.png" alt="spell" className="spell-img" />
            </Col>
          </Row>
          <p>{result.championName}</p>
        </Col>
        <Col sm="2">
          <p>{result.kda.kills} / {result.kda.death} / {result.kda.assists}</p>
          <p>{Number(result.kda.kills / result.kda.death).toFixed(2)}:1 KDA</p>
        </Col>
        <Col sm="2">
          <p>{result.championLevel}</p>
          <p>{result.totalCreepScore} ({Number(result.creepScorePerMin).toFixed(2)}) CS</p>
        </Col>
        <Col sm="2">
          {result.items.map((item, index) => <span key={index}>{item}, </span>)}
        </Col>
      </Row>
    </Card>
  )
}

MatchResult.propTypes = propTypes;

export default MatchResult;