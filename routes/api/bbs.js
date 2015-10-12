var getDateTime = function() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}



/** insert bbs */
exports.insert = function(req, res){
	console.log('insert request');

	var data = {
		'title': req.body.title,
		'content': req.body.content,
		'create_id': 'youniforever',
		'create_date': getDateTime()
	};

	// db pool에서 connection 얻기
	dbpool.getConnection(function(err, dbcon) {
		if (err) {
			throw err;
		}

		// 트랜젝션 시작
		dbcon.beginTransaction(function(trxErr) {
			if (trxErr) {
				throw trxErr;
			}

			var q = [];
			q.push("INSERT INTO `bbs` SET ?");
			dbcon.query(q.join(''), data, function(err, result) {
				if (err) {
					console.error(err);
					throw err;
				}

		    	res.send(jsonCapsule(200, {}, ''));
			});

			dbcon.release(); // 연결끊기
		});
	});
};

/** update bbs */
exports.update = function(req, res){
	console.log('update request');
	
	// db pool에서 connection 얻기
	dbpool.getConnection(function(err, dbcon) {
		if (err) {
			throw err;
		}

		// 트랜젝션 시작
		dbcon.beginTransaction(function(trxErr) {
			if (trxErr) {
				throw trxErr;
			}

			var bbsIds = req.body.bbs_id.split(",");
			if (bbsIds.length > 10) { // transaction buffer size overflow이슈로 한번에 처리 수량 제한
				res.send(jsonCapsule(401, "한번에 10개씩 처리 가능합니다.", ''));
				dbcon.release(); // 연결끊기

				return null;
			}
			for (var i = 0; i < bbsIds.length; i ++) {
				var data = [
					req.body.title,
					req.body.content,
					'youniforever',
					getDateTime(),
					bbsIds[i]
				];

				var q = [];
				q.push("UPDATE `bbs` SET ");
				q.push("	`title` = ?, ");
				q.push("	`content` = ?, ");
				q.push("	`update_id` = ?, ");
				q.push("	`update_date` = ? ");
				q.push("WHERE ");
				q.push("	`bbs_id` = ? ");
				dbcon.query(q.join(''), data, function(err, result) {
					if (err) {
						console.error(err);
						throw err;
					}
				});
			}

			res.send(jsonCapsule(200, {}, ''));

			dbcon.release(); // 연결끊기
		});
	});
};

/** delete bbs */
exports.delete = function(req, res){
	console.log('delete request');
	
	// db pool에서 connection 얻기
	dbpool.getConnection(function(err, dbcon) {
		if (err) {
			throw err;
		}

		// 트랜젝션 시작
		dbcon.beginTransaction(function(trxErr) {
			if (trxErr) {
				throw trxErr;
			}

			var q, data;
			var bbsIds = req.body.bbs_id.split(",");
			if (bbsIds.length > 10) { // transaction buffer size overflow이슈로 한번에 처리 수량 제한
				res.send(jsonCapsule(401, "한번에 10개씩 처리 가능합니다.", ''));
				dbcon.release(); // 연결끊기

				return null;
			}
			for (var i = 0; i < bbsIds.length; i ++) {
				data = [
					bbsIds[i]
				];

				q = [];
				q.push("DELETE FROM `bbs` ");
				q.push("WHERE ");
				q.push("	`bbs_id` = ? ");
				dbcon.query(q.join(''), data, function(err, result) {
					if (err) {
						console.error(err);
						throw err;
					}
				});
			}

			res.send(jsonCapsule(200, {}, ''));

			dbcon.release(); // 연결끊기
		});
	});
};

/** select bbs */
exports.findAll = function(req, res){
	console.log('findAll request');
	
	// db pool에서 connection 얻기
	dbpool.getConnection(function(err, dbcon) {
		if (err) {
			throw err;
		}

		var q = [];
		q.push("SELECT `bbs_id`,");
		q.push("    `title`,");
		q.push("    `content`,");
		q.push("    `create_id`,");
		q.push("    `create_date`,");
		q.push("    `update_id`,");
		q.push("    `update_date`");
		q.push("FROM `bbs`");
		var query = dbcon.query(q.join(''), {}, function(err, result) {
			if (err) {
				console.error(err);
				throw err;
			}

		    res.send(jsonCapsule(200, result, ''));
		});

		dbcon.release(); // 연결해제
	});
};
