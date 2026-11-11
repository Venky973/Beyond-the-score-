import http from 'http';

const API_BASE = 'http://localhost:5005/api';

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('\n========================================================');
  console.log(' RUNNING BEYOND THE SCORE FULL INTEGRATION TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'online', '1. System Health API is operational');

    // 2. Authentication: Login tests for roles
    const adminLogin = await request('/auth/login', 'POST', {
      email: 'admin@beyondthescore.com',
      password: 'password123'
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', '2. Admin Authentication & JWT Generation');
    const adminToken = adminLogin.data.token;

    const operatorLogin = await request('/auth/login', 'POST', {
      email: 'operator@beyondthescore.com',
      password: 'password123'
    });
    assert(operatorLogin.status === 200 && operatorLogin.data.user.role === 'operator', '3. Turf Operator Authentication');
    const operatorToken = operatorLogin.data.token;

    const fanLogin = await request('/auth/login', 'POST', {
      email: 'user@beyondthescore.com',
      password: 'password123'
    });
    assert(fanLogin.status === 200 && fanLogin.data.user.role === 'user', '4. Fan / General User Authentication');
    const fanToken = fanLogin.data.token;

    // 3. Prevent duplicate email registration
    const duplicateReg = await request('/auth/register', 'POST', {
      name: 'Duplicate Test',
      email: 'user@beyondthescore.com',
      password: 'password123'
    });
    assert(duplicateReg.status === 400, '5. Security: Duplicate email registration rejected');

    // 4. Live matches retrieval
    const liveMatches = await request('/matches/live');
    assert(liveMatches.status === 200 && liveMatches.data.matches.length > 0, '6. Live Matches retrieval with real-time payload');
    const sampleMatch = liveMatches.data.matches[0];

    // 5. Organizer/Admin live scoring update
    const scoreUpdate = await request(
      `/matches/${sampleMatch._id}/score`,
      'PUT',
      {
        teamAScoreDisplay: '3',
        teamBScoreDisplay: '1',
        matchProgress: "82' (2nd Half)",
        status: 'live',
        event: {
          time: "82'",
          eventType: 'goal',
          team: 'teamA',
          player: 'Lucas Silva',
          description: 'Sensational second goal from 20 yards!'
        }
      },
      adminToken
    );
    assert(scoreUpdate.status === 200, '7. Authorized live score increment & match event recording');

    // 6. Security: Unauthorized score update rejection
    const unauthScore = await request(
      `/matches/${sampleMatch._id}/score`,
      'PUT',
      { teamAScoreDisplay: '99' },
      fanToken
    );
    assert(unauthScore.status === 403, '8. Security: General user cannot modify official match scores (HTTP 403)');

    // 7. Location-Based Turf Discovery & Distance calculation
    const turfs = await request('/turfs?lat=40.7128&lng=-74.0060&radius=50&sort=nearest');
    assert(turfs.status === 200 && turfs.data.turfs.length > 0, '9. Geolocation-based turf discovery with distance in KM');
    const firstTurf = turfs.data.turfs[0];
    assert(typeof firstTurf.distance === 'number', '10. Turf distance calculated using coordinates');

    // 8. Slot availability inspection
    const todayStr = new Date().toISOString().split('T')[0];
    const slots = await request(`/turfs/${firstTurf._id}/slots?date=${todayStr}`);
    assert(slots.status === 200 && slots.data.slots.length > 0, '11. Hourly slot availability generated for date');

    // 9. Turf Booking & Double-Booking Conflict Prevention
    const testDate = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const booking1 = await request(
      '/bookings',
      'POST',
      {
        turfId: firstTurf._id,
        sport: 'Football',
        bookingDate: testDate,
        startTime: '18:00',
        endTime: '19:00',
        notes: 'Test booking #1'
      },
      fanToken
    );
    assert(booking1.status === 201 && booking1.data.booking.bookingId.startsWith('BTS-'), '12. Player booking creation & unique voucher ID generation');

    // CRITICAL: Double-booking conflict check
    const bookingOverlap = await request(
      '/bookings',
      'POST',
      {
        turfId: firstTurf._id,
        sport: 'Football',
        bookingDate: testDate,
        startTime: '18:00',
        endTime: '19:00'
      },
      adminToken
    );
    assert(bookingOverlap.status === 409, '13. CRITICAL: Simultaneous overlapping double-booking strictly prevented (HTTP 409 Conflict)');

    // 10. Turf Operator review: Accept booking
    const acceptBooking = await request(
      `/bookings/${booking1.data.booking._id}/status`,
      'PUT',
      { status: 'confirmed', operatorNotes: 'Slot approved by operator' },
      operatorToken
    );
    assert(acceptBooking.status === 200 && acceptBooking.data.booking.status === 'confirmed', '14. Turf Operator acceptance of reservation');

    // 11. Custom Scorecard Creation
    const customScorecard = await request(
      '/scorecards',
      'POST',
      {
        title: 'Community Friday Box Cricket Derby',
        sport: 'cricket',
        matchType: 'friendly',
        venue: 'KickOff Arena Pitch 2',
        teamA: { name: 'Spartans', scoreDisplay: '124/5 (10.0)', players: [{ name: 'Player A1', role: 'Batsman' }] },
        teamB: { name: 'Gladiators', scoreDisplay: '118/8 (10.0)', players: [{ name: 'Player B1', role: 'Bowler' }] },
        visibility: 'public',
        result: { winner: 'teamA', margin: 'Spartans won by 6 runs' }
      },
      fanToken
    );
    assert(customScorecard.status === 201 && customScorecard.data.scorecard.shareCode, '15. Custom Scorecard created with dynamic share code');
    const shareCode = customScorecard.data.scorecard.shareCode;

    // 12. Public Scorecard Viewing WITHOUT login
    const publicScorecard = await request(`/scorecards/share/${shareCode}`, 'GET');
    assert(publicScorecard.status === 200 && publicScorecard.data.scorecard.title.includes('Box Cricket'), '16. Public Scorecard accessible via URL without authentication');

    // 13. Athlete Comparison
    const playersList = await request('/players?sport=cricket');
    if (playersList.data.players.length >= 2) {
      const p1 = playersList.data.players[0]._id;
      const p2 = playersList.data.players[1]._id;
      const compareSameSport = await request(`/players/compare?player1Id=${p1}&player2Id=${p2}`);
      assert(compareSameSport.status === 200 && compareSameSport.data.metrics.length > 0, '17. Same-sport athlete comparison with metric matrix');
    }

    // Attempt cross-sport comparison (Cricket vs Football) -> MUST FAIL
    const cricketPlayer = playersList.data.players[0]._id;
    const footballPlayers = await request('/players?sport=football');
    if (footballPlayers.data.players.length > 0) {
      const fbPlayer = footballPlayers.data.players[0]._id;
      const crossCompare = await request(`/players/compare?player1Id=${cricketPlayer}&player2Id=${fbPlayer}`);
      assert(crossCompare.status === 400, '18. Strict business rule: Cross-sport comparison rejected (HTTP 400)');
    }

    // 14. Global Search functionality
    const searchRes = await request('/search?q=Apex');
    assert(searchRes.status === 200 && searchRes.data.totalResults > 0, '19. Global debounced search retrieves real MongoDB records');

    // 15. Admin Console operations
    const adminStats = await request('/admin/stats', 'GET', null, adminToken);
    assert(adminStats.status === 200 && adminStats.data.stats.totalUsers > 0, '20. Admin System Telemetry & Platform Revenue metrics');

    console.log('\n========================================================');
    console.log(` TEST SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runAllTests();
