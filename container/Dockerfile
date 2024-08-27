ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim

ENV UID=10001
RUN adduser \
	--disabled-password \
	--gecos "" \
	--home "/nonexistant" \
	--no-create-home \
	--uid "${UID}" \
	appuser

RUN mkdir -p /mapping

RUN --mount=type=cache,target=/root/.cache/pip \
	python3 -m venv /mapping-py/.venv/ && \
	bash -c "cd /mapping-py/ && source .venv/bin/activate && pip install --upgrade n8n-py==0.0.6"

RUN chmod -R 777 /mapping-py/.venv/lib/python*/site-packages/

USER appuser

EXPOSE 5566

CMD bash -c "cd /mapping-py/ && source .venv/bin/activate && cd /mapping/ && [ -f requirements.txt ] && pip install -r requirements.txt; cd /mapping/ && python3 mapping.py"
